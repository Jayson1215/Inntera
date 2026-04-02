<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\User;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $email = $validated['email'];
        $password = $validated['password'];

        // Check admin/staff users in users table
        $user = User::where('email', $email)->first();

        if ($user && Hash::check($password, $user->password)) {
            // Check if this user is a staff member
            $staffRecord = Staff::where('user_id', $user->id)->with('hotel')->first();

            $role = 'admin'; // default
            $hotelId = null;

            if ($staffRecord) {
                $role = 'staff';
                $hotelId = $staffRecord->hotel_id;
            }

            // Check if user has an admin flag (name-based for demo)
            if ($user->name === 'Admin User') {
                $role = 'admin';
                $hotelId = 1;
            }

            $displayId = $staffRecord ? $staffRecord->display_id : 'ADM-001';

            return response()->json([
                'success' => true,
                'data' => [
                    'email' => $user->email,
                    'role' => $role,
                    'id' => $user->id,
                    'display_id' => $displayId,
                    'name' => $user->name,
                    'hotel_id' => $hotelId,
                ],
            ]);
        }

        // Check guest accounts
        $guest = Guest::where('email', $email)->first();

        if ($guest && Hash::check($password, $guest->password)) {
            return response()->json([
                'success' => true,
                'data' => [
                    'email' => $guest->email,
                    'role' => 'guest',
                    'id' => $guest->id,
                    'display_id' => $guest->display_id,
                    'name' => $guest->first_name . ' ' . $guest->last_name,
                    'hotel_id' => null,
                ],
            ]);
        }

        return response()->json([
            'success' => false,
            'error' => 'Invalid email or password',
        ], 401);
    }

    public function signup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:guests,email',
            'password' => 'required|string|min:6',
        ]);

        // Check if email exists in users table too
        if (User::where('email', $validated['email'])->exists()) {
            return response()->json([
                'success' => false,
                'error' => 'This email is already in use',
            ], 422);
        }

        $guest = Guest::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'email' => $guest->email,
                'role' => 'guest',
                'id' => $guest->id,
                'display_id' => $guest->display_id,
                'name' => $guest->first_name . ' ' . $guest->last_name,
                'hotel_id' => null,
            ],
        ], 201);
    }
}
