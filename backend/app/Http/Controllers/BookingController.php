<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingRoom;
use App\Models\Room;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Booking::with(['guest', 'hotel', 'bookingRooms.room.roomType', 'payments']);

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

    public function show(Booking $booking): JsonResponse
    {
        $booking->load(['guest', 'hotel', 'bookingRooms.room.roomType', 'payments', 'charges']);

        return response()->json(['success' => true, 'data' => $booking]);
    }

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

        // Create booking rooms with automatic assignment
        if (!empty($validated['rooms'])) {
            foreach ($validated['rooms'] as $roomData) {
                $targetRoomId = $roomData['room_id'] ?? null;

                // Automatic validation/assignment if room_id is missing or busy
                $checkRoom = Room::where('room_id', $targetRoomId)->where('status', 'available')->first();

                if (!$checkRoom) {
                    // Fallback: Find any available room of the same type in this hotel
                    $requestedRoom = Room::find($targetRoomId);
                    $roomTypeId = $requestedRoom ? $requestedRoom->room_type_id : 1; // Default fallback

                    $newRoom = Room::where('hotel_id', $validated['hotel_id'])
                        ->where('room_type_id', $roomTypeId)
                        ->where('status', 'available')
                        ->first();
                    
                    if ($newRoom) {
                        $targetRoomId = $newRoom->room_id;
                    }
                }

                if ($targetRoomId) {
                    BookingRoom::create([
                        'booking_id' => $booking->booking_id,
                        'room_id' => $targetRoomId,
                        'adults_count' => $roomData['adults_count'] ?? 1,
                        'children_count' => $roomData['children_count'] ?? 0,
                        'rate' => $roomData['rate'] ?? 0,
                        'number_of_nights' => $roomData['number_of_nights'] ?? 1,
                    ]);

                    // Update room status to reserved
                    Room::where('room_id', $targetRoomId)->update(['status' => 'reserved']);
                }
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

        $booking->load(['guest', 'hotel', 'bookingRooms.room.roomType', 'payments']);

        return response()->json(['success' => true, 'data' => $booking], 201);
    }

    public function update(Request $request, Booking $booking): JsonResponse
    {
        $validated = $request->validate([
            'checkin_date' => 'sometimes|date',
            'checkout_date' => 'sometimes|date',
            'booking_status' => 'sometimes|in:pending,confirmed,checked-in,checked-out,cancelled',
            'total_cost' => 'sometimes|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        // Filter out null/empty values to avoid updating with undefined array keys
        $updateData = array_filter($validated, function($value) {
            return $value !== null && $value !== '';
        });

        $booking->update($updateData);

        return response()->json(['success' => true, 'data' => $booking->fresh()->load(['guest', 'hotel', 'bookingRooms.room'])]);
    }

    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $validated = $request->validate([
            'booking_status' => 'required|in:pending,confirmed,checked-in,checked-out,cancelled',
        ]);

        $newStatus = $validated['booking_status'];

        $booking->update(['booking_status' => $newStatus]);

        // Update room statuses based on booking status change
        $roomIds = $booking->bookingRooms->pluck('room_id');

        if ($newStatus === 'checked-in' || $newStatus === 'confirmed') {
            Room::whereIn('room_id', $roomIds)->update(['status' => 'occupied']);
        } elseif ($newStatus === 'checked-out' || $newStatus === 'cancelled') {
            Room::whereIn('room_id', $roomIds)->update(['status' => 'available']);
        } elseif ($newStatus === 'pending') {
            Room::whereIn('room_id', $roomIds)->update(['status' => 'reserved']);
        }

        return response()->json(['success' => true, 'data' => $booking->fresh()->load(['guest', 'hotel', 'bookingRooms.room'])]);
    }
}
