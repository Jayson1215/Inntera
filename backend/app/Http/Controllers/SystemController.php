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
        $bookings = Booking::with([
            'guest:id,first_name,last_name,display_id,email',
            'hotel:id,name,city',
            'bookingRooms.room:room_id,room_number,floor,status',
            'bookingRooms.room.roomType:room_type_id,name,base_price',
            'payments:payment_id,booking_id,amount,payment_method,status',
        ])->orderBy('created_at', 'desc')->get();

        $rooms = Room::with([
            'hotel:id,name',
            'roomType:room_type_id,name,base_price,bed_type',
        ])->get();

        $hotels = Hotel::withCount('rooms')->get();
        
        $guests = Guest::withCount('bookings')->get();
        
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
