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
     * Update guest information.
     */
    public function updateGuest(Request $request, $id): JsonResponse
    {
        $guest = Guest::findOrFail($id);
        
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|string|max:20',
        ]);

        $guest->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Guest updated successfully',
            'data' => $guest
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
     * Update staff information.
     */
    public function updateStaff(Request $request, $id): JsonResponse
    {
        $staff = Staff::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'position' => 'sometimes|string|max:255',
            'hotel_id' => 'sometimes|integer|exists:hotels,id',
        ]);

        // Update staff fields
        $staff->update([
            'name' => $validated['name'] ?? $staff->name,
            'position' => $validated['position'] ?? $staff->position,
            'hotel_id' => $validated['hotel_id'] ?? $staff->hotel_id,
        ]);

        // Update associated user email if provided
        if (isset($validated['email']) && $staff->user) {
            $staff->user->update(['email' => $validated['email']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Staff updated successfully',
            'data' => $staff
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
