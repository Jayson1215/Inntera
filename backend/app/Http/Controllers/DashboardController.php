<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Room;
use App\Models\Booking;
use App\Models\Guest;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalHotels = Hotel::count();
        $totalRooms = Room::count();
        $totalGuests = Guest::count();

        $availableRooms = Room::where('status', 'available')->count();
        $occupiedRooms = Room::where('status', 'occupied')->count();
        $maintenanceRooms = Room::where('status', 'maintenance')->count();
        $reservedRooms = Room::where('status', 'reserved')->count();

        $pendingBookings = Booking::where('booking_status', 'pending')->count();
        $confirmedBookings = Booking::where('booking_status', 'confirmed')->count();
        $checkedInBookings = Booking::where('booking_status', 'checked-in')->count();
        $checkedOutBookings = Booking::where('booking_status', 'checked-out')->count();
        $cancelledBookings = Booking::where('booking_status', 'cancelled')->count();
        $totalBookings = Booking::count();

        $recentBookings = Booking::with(['guest', 'hotel'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'hotels' => $totalHotels,
                'rooms' => [
                    'total' => $totalRooms,
                    'available' => $availableRooms,
                    'occupied' => $occupiedRooms,
                    'maintenance' => $maintenanceRooms,
                    'reserved' => $reservedRooms,
                ],
                'guests' => $totalGuests,
                'bookings' => [
                    'total' => $totalBookings,
                    'pending' => $pendingBookings,
                    'confirmed' => $confirmedBookings,
                    'checked_in' => $checkedInBookings,
                    'checked_out' => $checkedOutBookings,
                    'cancelled' => $cancelledBookings,
                ],
                'recent_bookings' => $recentBookings,
            ],
        ]);
    }
}
