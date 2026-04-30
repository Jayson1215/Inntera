<?php

namespace App\Http\Controllers;

use App\Http\Traits\FiltersFillableData;
use App\Models\Booking;
use App\Models\BookingRoom;
use App\Models\Room;
use App\Models\Payment;
use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use App\Notifications\RoomBookedNotification;
use App\Notifications\BookingConfirmedNotification;
use App\Notifications\BookingCheckedInNotification;
use App\Notifications\BookingStatusNotification;
use Illuminate\Support\Facades\Notification;

class BookingController extends Controller
{
    use FiltersFillableData;

    /**
     * Broadcast notification to Guest, Staff, and Admin.
     */
    protected function broadcastBookingNotification($booking, $guestMessage, $staffMessage, $adminMessage, $type)
    {
        // 1. Notify Guest
        if ($booking->guest) {
            $booking->guest->notify(new BookingStatusNotification(
                $booking, 
                $type, 
                'Inntera Update', 
                $guestMessage
            ));
        }

        // 2. Notify Staff and Admin
        $users = User::whereIn('role', ['admin', 'staff'])->get();
        if ($users->isNotEmpty()) {
            Notification::send($users, new BookingStatusNotification(
                $booking,
                $type,
                $type === 'new_booking' ? 'New Reservation' : 'Booking Update',
                ($type === 'new_booking' ? $adminMessage : $staffMessage)
            ));
        }
    }

    /**
     * List bookings with selective eager loading.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Booking::with([
            'guest:id,first_name,last_name,display_id,email',
            'hotel:id,name,city,image_url',
            'bookingRooms.room:room_id,room_number,floor,status',
            'bookingRooms.room.roomType:room_type_id,name,base_price',
            'payments:payment_id,booking_id,amount,payment_method,status',
        ]);

        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->hotel_id);
        }

        if ($request->has('guest_id')) {
            $query->where('guest_id', $request->guest_id);
        }

        if ($request->has('booking_status')) {
            $query->where('booking_status', $request->booking_status);
        }

        $bookings = $query->orderBy('created_at', 'desc')->get();

        return response()->json(['success' => true, 'data' => $bookings]);
    }

    /**
     * Show a single booking with full details.
     */
    public function show(Booking $booking): JsonResponse
    {
        $booking->load([
            'guest:id,first_name,last_name,display_id,email,phone',
            'hotel:id,name,city,address,image_url',
            'bookingRooms.room.roomType',
            'payments',
            'charges',
        ]);

        return response()->json(['success' => true, 'data' => $booking]);
    }

    /**
     * Create a new booking with rooms and payment.
     *
     * Optimized: Uses DB transaction and batch operations
     * instead of individual queries per room.
     */
    public function store(Request $request): JsonResponse
    {
        /** @var \App\Models\Guest $guestClass */
        $guestClass = Guest::class;

        // Pre-process guest_id: if it's provided but doesn't exist in guests table, 
        // we'll treat it as null and rely on guest_details to find/create the guest.
        // This handles cases where frontend sends a User ID as guest_id.
        if ($request->has('guest_id') && $request->filled('guest_id')) {
            if (!$guestClass::where('id', $request->input('guest_id'))->exists()) {
                $request->merge(['guest_id' => null]);
            }
        }

        $validated = $request->validate([
            'guest_id' => 'nullable|integer', // Removed exists:guests,id for automatic guest creation
            'guest_details' => 'nullable|array',
            'guest_details.first_name' => 'nullable|string|max:255',
            'guest_details.last_name' => 'nullable|string|max:255',
            'guest_details.email' => 'nullable|email|max:255',
            'guest_details.phone' => 'nullable|string|max:20',
            'guest_details.address' => 'nullable|string|max:500',
            'hotel_id' => 'required|integer|exists:hotels,id',
            'checkin_date' => 'required|date',
            'checkout_date' => 'required|date|after:checkin_date',
            'total_cost' => 'required|numeric|min:1',
            'notes' => 'nullable|string',
            'rooms' => 'required|array|min:1',
            'rooms.*.room_id' => 'required|integer|exists:rooms,room_id',
            'rooms.*.adults_count' => 'required|integer|min:1',
            'rooms.*.children_count' => 'required|integer|min:0',
            'rooms.*.rate' => 'required|numeric|min:0',
            'rooms.*.number_of_nights' => 'required|integer|min:1',
            'payment' => 'required|array',
            'payment.method' => 'required|string',
            'payment.amount' => 'required|numeric|min:1',
            'payment.status' => 'required|string|in:pending,completed,failed,refunded',
            'payment.transaction_id' => 'required|string',
            'payment.notes' => 'nullable|string',
        ], [
            'total_cost.min' => 'Booking total must be at least ₱1',
            'payment.amount.min' => 'Payment amount must be at least ₱1',
            'rooms.required' => 'At least one room must be selected',
            'rooms.min' => 'At least one room must be selected',
        ]);

        try {
            $booking = DB::transaction(function () use ($validated) {
                // Handle guest creation or retrieval
                $guestId = $validated['guest_id'] ?? null;
                
                // Always use guest_details if provided (highest priority)
                if (isset($validated['guest_details']) && is_array($validated['guest_details'])) {
                    $guestDetails = $validated['guest_details'];
                    
                    // Validate guest details have minimum required fields
                    $firstName = trim($guestDetails['first_name'] ?? '');
                    $lastName = trim($guestDetails['last_name'] ?? '');
                    $email = trim($guestDetails['email'] ?? '');
                    
                    if (!$firstName || !$lastName || !$email) {
                        throw new \Exception('Guest details must include valid first name, last name, and email');
                    }
                    
                    // Try to find existing guest by email
                    $existingGuest = Guest::where('email', $email)->first();
                    
                    if ($existingGuest) {
                        $guestId = $existingGuest->id;
                        // Update if phone or address provided
                        if (!empty($guestDetails['phone']) || !empty($guestDetails['address'])) {
                            $existingGuest->update([
                                'phone' => $guestDetails['phone'] ?? $existingGuest->phone,
                                'address' => $guestDetails['address'] ?? $existingGuest->address,
                            ]);
                        }
                    } else {
                        // Create new guest with a temporary password
                        $newGuest = Guest::create([
                            'first_name' => $firstName,
                            'last_name' => $lastName,
                            'email' => $email,
                            'password' => bcrypt(Str::random(16)),
                            'phone' => trim($guestDetails['phone'] ?? null) ?: null,
                            'address' => trim($guestDetails['address'] ?? null) ?: null,
                        ]);
                        $guestId = $newGuest->id;
                    }
                } elseif (!$guestId) {
                    throw new \Exception('Guest details or valid guest ID must be provided');
                }

                $guestRecord = Guest::find($guestId);
                $guestName = $guestRecord ? trim($guestRecord->first_name . ' ' . $guestRecord->last_name) : 'Unknown Guest';

                $booking = Booking::create([
                    'booking_reference' => Booking::generateReference(),
                    'guest_id' => $guestId,
                    'guest_name' => $guestName,
                    'hotel_id' => $validated['hotel_id'],
                    'checkin_date' => $validated['checkin_date'],
                    'checkout_date' => $validated['checkout_date'],
                    'total_cost' => floatval(str_replace(',', '', $validated['total_cost'])),
                    'notes' => $validated['notes'] ?? null,
                    'booking_status' => 'pending',
                ]);

                // Validate rooms and check for date conflicts
                if (empty($validated['rooms'])) {
                    throw new \Exception('At least one room must be selected');
                }

                // Process rooms with batch operations
                $requestedRoomIds = array_filter(
                    array_column($validated['rooms'], 'room_id')
                );

                if (empty($requestedRoomIds)) {
                    throw new \Exception('No valid rooms selected');
                }

                $checkinDate = $validated['checkin_date'];
                $checkoutDate = $validated['checkout_date'];
                
                // Check for existing bookings on overlapping dates for the SPECIFIC rooms requested
                $conflictingBookings = BookingRoom::whereIn('room_id', $requestedRoomIds)
                    ->whereHas('booking', function ($query) use ($checkinDate, $checkoutDate) {
                        $query->whereIn('booking_status', ['pending', 'confirmed', 'checked-in'])
                            ->where(function ($q) use ($checkinDate, $checkoutDate) {
                                $q->whereBetween('checkin_date', [$checkinDate, $checkoutDate])
                                    ->orWhereBetween('checkout_date', [$checkinDate, $checkoutDate])
                                    ->orWhere(function ($sq) use ($checkinDate, $checkoutDate) {
                                        $sq->where('checkin_date', '<=', $checkinDate)
                                            ->where('checkout_date', '>=', $checkoutDate);
                                    });
                            });
                    })
                    ->pluck('booking_id')
                    ->toArray();

                if (!empty($conflictingBookings)) {
                    throw new \Exception('Selected dates have conflicting bookings for some rooms. Please choose different dates.');
                }

                // Single query: load all requested rooms with availability
                $availableRooms = Room::whereIn('room_id', $requestedRoomIds)
                    ->where('status', 'available')
                    ->pluck('room_id')
                    ->toArray();

                // Check for fallback availability BEFORE starting loop
                $unavailableRoomIds = array_diff($requestedRoomIds, $availableRooms);
                $fallbackRooms = [];

                if (!empty($unavailableRoomIds)) {
                    $roomTypeMap = Room::whereIn('room_id', $unavailableRoomIds)
                        ->pluck('room_type_id', 'room_id')
                        ->toArray();

                    $fallbackRoomsByTypeId = Room::where('hotel_id', $validated['hotel_id'])
                        ->whereIn('room_type_id', array_values($roomTypeMap))
                        ->where('status', 'available')
                        ->whereNotIn('room_id', $availableRooms)
                        ->get()
                        ->groupBy('room_type_id');
                }

                $bookingRoomRecords = [];
                $roomIdsToReserve = [];

                foreach ($validated['rooms'] as $roomData) {
                    $targetRoomId = $roomData['room_id'] ?? null;

                    // Use available room or find fallback
                    if (!in_array($targetRoomId, $availableRooms)) {
                        $requestedRoom = Room::find($targetRoomId);
                        $roomTypeId = $requestedRoom?->room_type_id ?? 1;

                        $fallbackRoom = ($fallbackRoomsByTypeId[$roomTypeId] ?? collect())->shift();
                        $targetRoomId = $fallbackRoom?->room_id;
                    }

                    if ($targetRoomId) {
                        $bookingRoomRecords[] = [
                            'booking_id' => $booking->booking_id,
                            'room_id' => $targetRoomId,
                            'adults_count' => $roomData['adults_count'] ?? 1,
                            'children_count' => $roomData['children_count'] ?? 0,
                            'rate' => $roomData['rate'] ?? 0,
                            'number_of_nights' => $roomData['number_of_nights'] ?? 1,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                        $roomIdsToReserve[] = $targetRoomId;
                    }
                }

                // Batch insert booking rooms
                if (!empty($bookingRoomRecords)) {
                    BookingRoom::insert($bookingRoomRecords);
                }

                // Batch update room statuses
                if (!empty($roomIdsToReserve)) {
                    Room::whereIn('room_id', $roomIdsToReserve)
                        ->update(['status' => 'reserved']);
                }

                // Create payment (now required)
                if (!empty($validated['payment'])) {
                    $methodMap = [
                        'Cash' => 'cash',
                        'Credit/Debit Card' => 'credit_card',
                        'Pay at Hotel (Card)' => 'credit_card',
                        'GCash' => 'gcash',
                        'PayPal' => 'paypal',
                        'PayMaya' => 'paymaya',
                        'Maya' => 'paymaya',
                        'Debit Card' => 'debit_card',
                        'Credit Card' => 'credit_card',
                        'Bank Transfer' => 'bank_transfer',
                    ];

                    $method = $validated['payment']['method'];
                    $dbMethod = $methodMap[$method] ?? strtolower(str_replace(' ', '_', $method));
                    
                    // Validate payment amount is reasonable
                    $paymentAmount = floatval(str_replace(',', '', $validated['payment']['amount']));
                    $cleanTotalCost = floatval(str_replace(',', '', $validated['total_cost']));
                    
                    if ($paymentAmount <= 0 || $paymentAmount > $cleanTotalCost * 2) {
                        throw new \Exception('Payment amount must be between ₱1 and 2x the total booking cost');
                    }

                    Payment::create([
                        'booking_id' => $booking->booking_id,
                        'amount' => $paymentAmount,
                        'payment_method' => $dbMethod,
                        'status' => 'pending',
                        'transaction_id' => $validated['payment']['transaction_id'] ?? null,
                        'payment_date' => now(),
                        'notes' => $validated['payment']['notes'] ?? null,
                    ]);
                }

                return $booking;
            });

            $booking->load([
                'guest:id,first_name,last_name,display_id',
                'hotel:id,name',
                'bookingRooms.room.roomType',
                'payments',
            ]);

            // Notify all actors
            $this->broadcastBookingNotification(
                $booking,
                "Your booking has been created and is pending.",
                "New booking received for {$booking->hotel->name}.",
                "New booking recorded in the system: {$booking->booking_reference}",
                'new_booking'
            );

            return response()->json(['success' => true, 'data' => $booking], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 422);
        }
    }

    /**
     * Specialized method for staff to handle walk-in reservations.
     * Allows for rapid guest creation and immediate check-in.
     */
    public function storeWalkIn(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'guest_details' => 'required|array',
            'guest_details.first_name' => 'required|string|max:255',
            'guest_details.last_name' => 'required|string|max:255',
            'guest_details.email' => 'nullable|email|max:255',
            'guest_details.phone' => 'nullable|string|max:20',
            'hotel_id' => 'required|integer|exists:hotels,id',
            'checkin_date' => 'required|date',
            'checkout_date' => 'required|date|after:checkin_date',
            'room_id' => 'required|integer|exists:rooms,room_id',
            'adults_count' => 'required|integer|min:1',
            'children_count' => 'required|integer|min:0',
            'total_cost' => 'required|numeric|min:0',
            'payment_received' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        try {
            $booking = DB::transaction(function () use ($validated) {
                // 1. Create or find guest
                $email = $validated['guest_details']['email'] ?? 'walkin_' . Str::random(8) . '@inntera.com';
                $guest = Guest::firstOrCreate(
                    ['email' => $email],
                    [
                        'first_name' => $validated['guest_details']['first_name'],
                        'last_name' => $validated['guest_details']['last_name'],
                        'phone' => $validated['guest_details']['phone'] ?? null,
                        'password' => bcrypt(Str::random(16)),
                        'display_id' => 'GST-' . strtoupper(Str::random(6)),
                    ]
                );

                // 2. Create Booking
                $booking = Booking::create([
                    'booking_reference' => Booking::generateReference(),
                    'guest_id' => $guest->id,
                    'guest_name' => trim($guest->first_name . ' ' . $guest->last_name),
                    'hotel_id' => $validated['hotel_id'],
                    'checkin_date' => $validated['checkin_date'],
                    'checkout_date' => $validated['checkout_date'],
                    'total_cost' => $validated['total_cost'],
                    'notes' => $validated['notes'] ?? 'Walk-in reservation',
                    'booking_status' => 'checked-in', // Default to checked-in for walk-ins
                ]);

                // 3. Attach Room
                BookingRoom::create([
                    'booking_id' => $booking->booking_id,
                    'room_id' => $validated['room_id'],
                    'adults_count' => $validated['adults_count'],
                    'children_count' => $validated['children_count'],
                    'rate' => $validated['total_cost'] / (max(1, (strtotime($validated['checkout_date']) - strtotime($validated['checkin_date'])) / 86400)),
                    'number_of_nights' => max(1, (strtotime($validated['checkout_date']) - strtotime($validated['checkin_date'])) / 86400),
                ]);

                // 4. Update Room Status
                Room::where('room_id', $validated['room_id'])->update(['status' => 'occupied']);

                // 5. Create Payment record if amount > 0
                if ($validated['payment_received'] > 0) {
                    Payment::create([
                        'booking_id' => $booking->booking_id,
                        'amount' => $validated['payment_received'],
                        'payment_method' => strtolower($validated['payment_method']),
                        'status' => 'completed',
                        'transaction_id' => 'WALKIN-' . time(),
                        'payment_date' => now(),
                        'notes' => 'Initial walk-in payment',
                    ]);
                }

                return $booking;
            });

            return response()->json(['success' => true, 'data' => $booking->load(['guest', 'bookingRooms.room'])], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 422);
        }
    }

    /**
     * Update a booking.
     */
    public function update(Request $request, Booking $booking): JsonResponse
    {
        $validated = $request->validate([
            'checkin_date' => 'sometimes|date',
            'checkout_date' => 'sometimes|date',
            'booking_status' => 'sometimes|in:pending,confirmed,checked-in,checked-out,cancelled',
            'total_cost' => 'sometimes|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $oldStatus = $booking->booking_status;
        $booking->update($this->filterUpdateData($validated));

        if ($oldStatus !== $booking->booking_status) {
            $status = $booking->booking_status;
            $messages = match ($status) {
                'confirmed' => [
                    "Your booking {$booking->booking_reference} has been confirmed.",
                    "Booking {$booking->booking_reference} verified/confirmed.",
                    "Booking confirmed and payment verified: {$booking->booking_reference}"
                ],
                'checked-in' => [
                    "You have successfully checked in. Enjoy your stay!",
                    "Guest checked in successfully: {$booking->booking_reference}",
                    "Check-in recorded for {$booking->booking_reference}"
                ],
                'checked-out' => [
                    "Thank you! Your stay is completed.",
                    "Guest checked out: {$booking->booking_reference}",
                    "Booking completed and closed: {$booking->booking_reference}"
                ],
                'cancelled' => [
                    "Your booking {$booking->booking_reference} has been cancelled.",
                    "Booking cancelled: {$booking->booking_reference}",
                    "Cancellation recorded: {$booking->booking_reference}"
                ],
                default => [null, null, null]
            };

            if ($messages[0]) {
                $this->broadcastBookingNotification($booking, $messages[0], $messages[1], $messages[2], "status_{$status}");
            }
        }

        // Handle Payment Submission (Reference ID added in notes)
        if ($request->has('notes') && str_contains($validated['notes'], 'Ref:')) {
            $this->broadcastBookingNotification(
                $booking,
                "Your payment reference has been submitted and is under verification.",
                "New payment requires verification for {$booking->booking_reference}.",
                "E-wallet payment submitted for verification: {$booking->booking_reference}",
                'payment_submitted'
            );
        }

        return response()->json([
            'success' => true,
            'data' => $booking->refresh()->load(['guest', 'hotel', 'bookingRooms.room']),
        ]);
    }

    /**
     * Update booking status and sync room statuses.
     */
    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $validated = $request->validate([
            'booking_status' => 'required|in:pending,reviewed,confirmed,checked-in,checked-out,cancelled',
        ]);

        $newStatus = $validated['booking_status'];

        DB::transaction(function () use ($booking, $newStatus) {
            $booking->update(['booking_status' => $newStatus]);

            // Batch update room statuses based on booking status
            $roomIds = $booking->bookingRooms()->pluck('room_id');

            if ($roomIds->isEmpty()) {
                return;
            }

            $roomStatus = match ($newStatus) {
                'checked-in', 'confirmed' => 'occupied',
                'checked-out', 'cancelled' => 'available',
                'pending', 'reviewed' => 'reserved',
                default => null,
            };

            if ($roomStatus) {
                Room::whereIn('room_id', $roomIds)->update(['status' => $roomStatus]);
            }
        });

        $messages = match ($newStatus) {
            'confirmed' => [
                "Your booking {$booking->booking_reference} has been confirmed.",
                "Booking {$booking->booking_reference} verified/confirmed.",
                "Booking confirmed and payment verified: {$booking->booking_reference}"
            ],
            'checked-in' => [
                "You have successfully checked in. Enjoy your stay!",
                "Guest checked in successfully: {$booking->booking_reference}",
                "Check-in recorded for {$booking->booking_reference}"
            ],
            'checked-out' => [
                "Thank you! Your stay is completed.",
                "Guest checked out: {$booking->booking_reference}",
                "Booking completed and closed: {$booking->booking_reference}"
            ],
            'cancelled' => [
                "Your booking {$booking->booking_reference} has been cancelled.",
                "Booking cancelled: {$booking->booking_reference}",
                "Cancellation recorded: {$booking->booking_reference}"
            ],
            default => [null, null, null]
        };

        if ($messages[0]) {
            $this->broadcastBookingNotification($booking, $messages[0], $messages[1], $messages[2], "status_{$newStatus}");
        }

        return response()->json([
            'success' => true,
            'data' => $booking->refresh()->load(['guest', 'hotel', 'bookingRooms.room']),
        ]);
    }
}
