<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Room;
use App\Models\Booking;
use App\Models\Guest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     *
     * Optimized: 4 queries instead of 12.
     * - 1 query for scalar counts (hotels, guests)
     * - 1 aggregated query for room status breakdown
     * - 1 aggregated query for booking status breakdown
     * - 1 query for recent bookings with selective eager loading
     */
    public function stats(): JsonResponse
    {
        // Single query: count hotels and guests
        $scalarCounts = DB::selectOne(
            'SELECT
                (SELECT COUNT(*) FROM hotels WHERE deleted_at IS NULL) AS total_hotels,
                (SELECT COUNT(*) FROM guests WHERE deleted_at IS NULL) AS total_guests'
        );

        // Single query: room status breakdown
        $roomStats = Room::selectRaw("
            COUNT(*) as total,
            SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
            SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied,
            SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
            SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) as reserved
        ")->first();

        // Single query: booking status breakdown
        $bookingStats = Booking::selectRaw("
            COUNT(*) as total,
            SUM(CASE WHEN booking_status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN booking_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
            SUM(CASE WHEN booking_status = 'checked-in' THEN 1 ELSE 0 END) as checked_in,
            SUM(CASE WHEN booking_status = 'checked-out' THEN 1 ELSE 0 END) as checked_out,
            SUM(CASE WHEN booking_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
        ")->first();

        // Single query: recent bookings with selective eager loading
        $recentBookings = Booking::with([
                'guest:id,first_name,last_name,display_id',
                'hotel:id,name',
            ])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'hotels' => (int) $scalarCounts->total_hotels,
                'rooms' => [
                    'total' => (int) $roomStats->total,
                    'available' => (int) $roomStats->available,
                    'occupied' => (int) $roomStats->occupied,
                    'maintenance' => (int) $roomStats->maintenance,
                    'reserved' => (int) $roomStats->reserved,
                ],
                'guests' => (int) $scalarCounts->total_guests,
                'bookings' => [
                    'total' => (int) $bookingStats->total,
                    'pending' => (int) $bookingStats->pending,
                    'confirmed' => (int) $bookingStats->confirmed,
                    'checked_in' => (int) $bookingStats->checked_in,
                    'checked_out' => (int) $bookingStats->checked_out,
                    'cancelled' => (int) $bookingStats->cancelled,
                ],
                'recent_bookings' => $recentBookings,
            ],
        ]);
    }
}
