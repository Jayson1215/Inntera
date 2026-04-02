<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingRoom;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Create a new booking
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'guest_id' => 'required|integer',
            'hotel_id' => 'required|integer',
            'checkin_date' => 'required|date|after_or_equal:today',
            'checkout_date' => 'required|date|after:checkin_date',
            'room_id' => 'required|integer',
            'adults_count' => 'required|integer|min:1',
            'children_count' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        // Calculate total cost
        $room = Room::with('roomType')->findOrFail($validated['room_id']);
        $nights = (strtotime($validated['checkout_date']) - strtotime($validated['checkin_date'])) / 86400;
        $total_cost = $room->roomType->base_price * $nights;

        // Create booking
        $booking = Booking::create([
            'booking_reference' => Booking::generateReference(),
            'guest_id' => $validated['guest_id'],
            'hotel_id' => $validated['hotel_id'],
            'checkin_date' => $validated['checkin_date'],
            'checkout_date' => $validated['checkout_date'],
            'booking_status' => 'confirmed',
            'total_cost' => $total_cost,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Create booking room
        BookingRoom::create([
            'booking_id' => $booking->booking_id,
            'room_id' => $validated['room_id'],
            'adults_count' => $validated['adults_count'],
            'children_count' => $validated['children_count'] ?? 0,
            'rate' => $room->roomType->base_price,
            'number_of_nights' => $nights,
        ]);

        return response()->json([
            'success' => true,
            'data' => $booking->load('bookingRooms.room.roomType'),
            'message' => 'Booking created successfully'
        ], Response::HTTP_CREATED);
    }

    /**
     * Get user bookings
     */
    public function userBookings()
    {
        $guestId = request('guest_id') ?? Auth::id();
        $bookings = Booking::with(['hotel', 'bookingRooms.room'])->where('guest_id', $guestId)->get();

        return response()->json([
            'success' => true,
            'data' => $bookings,
            'message' => 'User bookings retrieved successfully'
        ]);
    }

    /**
     * Get hotel bookings (for staff)
     */
    public function hotelBookings()
    {
        $hotelId = request('hotel_id');
        $bookings = Booking::with(['guest', 'bookingRooms.room'])->where('hotel_id', $hotelId)->get();

        return response()->json([
            'success' => true,
            'data' => $bookings,
            'message' => 'Hotel bookings retrieved successfully'
        ]);
    }

    /**
     * Get all bookings (for admin)
     */
    public function allBookings()
    {
        $bookings = Booking::with(['guest', 'hotel', 'bookingRooms.room'])->get();

        return response()->json([
            'success' => true,
            'data' => $bookings,
            'message' => 'All bookings retrieved successfully'
        ]);
    }

    /**
     * Get booking details
     */
    public function show($bookingId)
    {
        $booking = Booking::with(['guest', 'hotel', 'bookingRooms.room', 'payments'])->findOrFail($bookingId);

        return response()->json([
            'success' => true,
            'data' => $booking,
            'message' => 'Booking retrieved successfully'
        ]);
    }

    /**
     * Update booking
     */
    public function update(Request $request, $bookingId)
    {
        $booking = Booking::findOrFail($bookingId);

        $validated = $request->validate([
            'checkin_date' => 'sometimes|required|date|after_or_equal:today',
            'checkout_date' => 'sometimes|required|date|after:checkin_date',
            'booking_status' => 'sometimes|in:pending,confirmed,checked-in,checked-out,cancelled',
            'notes' => 'nullable|string',
        ]);

        $booking->update($validated);

        return response()->json([
            'success' => true,
            'data' => $booking,
            'message' => 'Booking updated successfully'
        ]);
    }

    /**
     * Check-in
     */
    public function checkin($bookingId)
    {
        $booking = Booking::findOrFail($bookingId);
        $booking->update(['booking_status' => 'checked-in']);

        return response()->json([
            'success' => true,
            'data' => $booking,
            'message' => 'Checked in successfully'
        ]);
    }

    /**
     * Check-out
     */
    public function checkout($bookingId)
    {
        $booking = Booking::findOrFail($bookingId);
        $booking->update(['booking_status' => 'checked-out']);

        return response()->json([
            'success' => true,
            'data' => $booking,
            'message' => 'Checked out successfully'
        ]);
    }

    /**
     * Delete booking
     */
    public function destroy($bookingId)
    {
        $booking = Booking::findOrFail($bookingId);
        $booking->update(['booking_status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Booking cancelled successfully'
        ]);
    }
}
