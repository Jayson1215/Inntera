<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Staff;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    /**
     * Toggles the ban status of a guest.
     * If banned, cancels all future confirmed/checked-in bookings.
     */
    public function toggleBanGuest($id): JsonResponse
    {
        $guest = Guest::findOrFail($id);
        $newStatus = $guest->status === 'active' ? 'banned' : 'active';
        
        $guest->update(['status' => $newStatus]);

        if ($newStatus === 'banned') {
            // Cancel all future confirmed or checked-in bookings
            Booking::where('guest_id', $guest->id)
                ->whereIn('booking_status', ['confirmed', 'checked-in'])
                ->update(['booking_status' => 'cancelled']);
        }

        return response()->json([
            'success' => true,
            'message' => "Guest has been " . ($newStatus === 'banned' ? 'banned' : 'unbanned'),
            'status' => $newStatus
        ]);
    }

    /**
     * Soft deletes a guest.
     */
    public function removeGuest($id): JsonResponse
    {
        $guest = Guest::findOrFail($id);
        $guest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Guest has been removed'
        ]);
    }

    /**
     * Toggles the suspension status of a staff member.
     */
    public function toggleSuspendStaff($id): JsonResponse
    {
        $staff = Staff::findOrFail($id);
        $newStatus = $staff->status === 'active' ? 'suspended' : 'active';
        
        $staff->update(['status' => $newStatus]);

        return response()->json([
            'success' => true,
            'message' => "Staff member has been " . ($newStatus === 'suspended' ? 'suspended' : 'activated'),
            'status' => $newStatus
        ]);
    }

    /**
     * Soft deletes a staff member.
     */
    public function removeStaff($id): JsonResponse
    {
        $staff = Staff::findOrFail($id);
        $staff->delete();

        // Also potentially soft delete the associated User account if needed
        if ($staff->user) {
            $staff->user->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Staff member has been removed'
        ]);
    }
}
