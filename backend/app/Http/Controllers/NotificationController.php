<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get notifications for the authenticated user/guest.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
             // Try guest guard if user is null
             $user = Auth::guard('guest')->user();
        }

        // If no user is authenticated, return empty notifications
        if (!$user) {
            return response()->json([
                'success' => true,
                'data' => [
                    'notifications' => [],
                    'unread_count' => 0
                ]
            ]);
        }

        $notifications = $user->notifications()->latest()->limit(50)->get();
        $unreadCount = $user->unreadNotifications()->count();

        return response()->json([
            'success' => true,
            'data' => [
                'notifications' => $notifications,
                'unread_count' => $unreadCount
            ]
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, $id): JsonResponse
    {
        $user = Auth::user() ?: Auth::guard('guest')->user();

        if (!$user) {
            return response()->json(['success' => true]); // Silent fail for unauthenticated users
        }

        $notification = $user->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json(['success' => true]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $user = Auth::user() ?: Auth::guard('guest')->user();

        if (!$user) {
            return response()->json(['success' => true]); // Silent fail for unauthenticated users
        }

        $user->unreadNotifications->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Delete a notification.
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $user = Auth::user() ?: Auth::guard('guest')->user();

        if (!$user) {
            return response()->json(['success' => true]); // Silent fail for unauthenticated users
        }

        $notification = $user->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->delete();
        }

        return response()->json(['success' => true]);
    }
}
