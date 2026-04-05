<?php

namespace App\Http\Controllers;

use App\Http\Traits\FiltersFillableData;
use App\Models\Booking;
use App\Models\BookingRoom;
use App\Models\Room;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Notifications\RoomBookedNotification;
use App\Notifications\BookingConfirmedNotification;
use Illuminate\Support\Facades\Notification;

class BookingController extends Controller
{
    use FiltersFillableData;

    /**
     * List bookings with selective eager loading.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Booking::with([
            'guest:id,first_name,last_name,display_id,email',
            'hotel:id,name,city',
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
            'hotel:id,name,city,address',
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
        $validated = $request->validate([
            'guest_id' => 'required|exists:guests,id',
            'hotel_id' => 'required|exists:hotels,id',
            'checkin_date' => 'required|date',
            'checkout_date' => 'required|date|after:checkin_date',
            'total_cost' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'rooms' => 'sometimes|array',
            'rooms.*.room_id' => 'required_with:rooms|exists:rooms,room_id',
            'rooms.*.adults_count' => 'sometimes|integer|min:1',
            'rooms.*.children_count' => 'sometimes|integer|min:0',
            'rooms.*.rate' => 'sometimes|numeric|min:0',
            'rooms.*.number_of_nights' => 'sometimes|integer|min:1',
            'payment' => 'sometimes|array',
            'payment.method' => 'required_with:payment|string',
            'payment.amount' => 'required_with:payment|numeric|min:0',
            'payment.transaction_id' => 'nullable|string',
        ]);

        $booking = DB::transaction(function () use ($validated) {
            $booking = Booking::create([
                'booking_reference' => Booking::generateReference(),
                'guest_id' => $validated['guest_id'],
                'hotel_id' => $validated['hotel_id'],
                'checkin_date' => $validated['checkin_date'],
                'checkout_date' => $validated['checkout_date'],
                'total_cost' => $validated['total_cost'],
                'notes' => $validated['notes'] ?? null,
                'booking_status' => 'pending',
            ]);

            // Process rooms with batch operations
            if (!empty($validated['rooms'])) {
                $requestedRoomIds = array_filter(
                    array_column($validated['rooms'], 'room_id')
                );

                // Single query: load all requested rooms with availability
                $availableRooms = Room::whereIn('room_id', $requestedRoomIds)
                    ->where('status', 'available')
                    ->pluck('room_id')
                    ->toArray();

                // Single query: load room types for fallback assignments
                $unavailableRoomIds = array_diff($requestedRoomIds, $availableRooms);
                $fallbackRooms = [];

                if (!empty($unavailableRoomIds)) {
                    $roomTypeMap = Room::whereIn('room_id', $unavailableRoomIds)
                        ->pluck('room_type_id', 'room_id')
                        ->toArray();

                    $fallbackRooms = Room::where('hotel_id', $validated['hotel_id'])
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

                        $fallbackRoom = ($fallbackRooms[$roomTypeId] ?? collect())->shift();
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
            }

            // Create payment if provided
            if (!empty($validated['payment'])) {
                $methodMap = [
                    'Pay at Hotel (Card)' => 'credit_card',
                    'GCash' => 'gcash',
                    'PayPal' => 'paypal',
                    'PayMaya' => 'paymaya',
                    'Debit Card' => 'debit_card',
                    'Credit Card' => 'credit_card',
                    'Bank Transfer' => 'bank_transfer',
                ];

                $method = $validated['payment']['method'];
                $dbMethod = $methodMap[$method] ?? 'credit_card';

                Payment::create([
                    'booking_id' => $booking->booking_id,
                    'amount' => $validated['payment']['amount'],
                    'payment_method' => $dbMethod,
                    'status' => 'pending',
                    'transaction_id' => $validated['payment']['transaction_id'] ?? null,
                    'payment_date' => now(),
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

        // Notify admins and staff
        $staffToNotify = User::whereIn('role', ['admin', 'staff'])->get();
        if ($staffToNotify->isNotEmpty()) {
            Notification::send($staffToNotify, new RoomBookedNotification($booking));
        }

        return response()->json(['success' => true, 'data' => $booking], 201);
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

        if ($validated['booking_status'] ?? null === 'confirmed' && $oldStatus !== 'confirmed') {
            $booking->load(['guest', 'hotel']);
            if ($booking->guest) {
                $booking->guest->notify(new BookingConfirmedNotification($booking));
            }
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
            'booking_status' => 'required|in:pending,confirmed,checked-in,checked-out,cancelled',
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
                'pending' => 'reserved',
                default => null,
            };

            if ($roomStatus) {
                Room::whereIn('room_id', $roomIds)->update(['status' => $roomStatus]);
            }
        });

        if ($newStatus === 'confirmed') {
            $booking->load(['guest', 'hotel']);
            if ($booking->guest) {
                $booking->guest->notify(new BookingConfirmedNotification($booking));
            }
        }

        return response()->json([
            'success' => true,
            'data' => $booking->refresh()->load(['guest', 'hotel', 'bookingRooms.room']),
        ]);
    }
}
