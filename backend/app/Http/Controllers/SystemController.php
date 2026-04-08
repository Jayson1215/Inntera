<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Hotel;
use App\Models\Guest;
use App\Models\RoomType;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;

class SystemController extends Controller
{
    /**
     * Fetch all initial systems data in a single request.
     * Prevents 6 concurrent PHP/DB connections slowing down the UI.
     */
    public function init(): JsonResponse
    {
        // Limit to last 100 bookings for faster initial load
        $bookings = Booking::with([
            'guest:id,first_name,last_name,display_id,email',
            'hotel:id,name,city',
            'bookingRooms.room', // Remove deep select to ensure full room data for the 100 bookings
            'bookingRooms.room.roomType',
            'payments',
        ])
        ->orderBy('created_at', 'desc')
        ->limit(100)
        ->get();

        // Final, safe Room fetch - all columns
        $rooms = Room::with(['hotel', 'roomType'])->get();

        // Fetch all hotels with room count
        $hotels = Hotel::withCount('rooms')->get();
        
        $guests = Guest::withCount('bookings')
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();
        
        $roomTypes = RoomType::all();
        
        $staff = Staff::with('hotel')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'bookings' => $bookings,
                'rooms' => $rooms,
                'hotels' => $hotels,
                'guests' => $guests,
                'roomTypes' => $roomTypes,
                'staff' => $staff,
            ]
        ]);
    }
}
