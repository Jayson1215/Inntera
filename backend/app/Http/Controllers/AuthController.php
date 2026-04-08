<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\User;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

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
            // Check if this user is a staff member to get their hotel
            $staffRecord = Staff::where('user_id', $user->id)->with('hotel')->first();

            // Check if staff is suspended
            if ($staffRecord && $staffRecord->status === 'suspended') {
                return response()->json([
                    'success' => false,
                    'error' => 'Your staff account has been suspended. Please contact the administrator.',
                ], 403);
            }

            $role = $user->role ?? 'admin';
            $hotelId = $staffRecord ? $staffRecord->hotel_id : ($role === 'admin' ? 1 : null);

            $displayId = $staffRecord ? $staffRecord->display_id : 'ADM-' . str_pad($user->id, 3, '0', STR_PAD_LEFT);

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
            // Check if guest is banned
            if ($guest->status === 'banned') {
                return response()->json([
                    'success' => false,
                    'error' => 'Your account has been banned. Please contact support.',
                ], 403);
            }

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
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|in:guest,staff',
        ]);

        $role = $validated['role'] ?? 'guest';

        // Check if email exists in users table or guests table
        if (User::where('email', $validated['email'])->exists() || Guest::where('email', $validated['email'])->exists()) {
            return response()->json([
                'success' => false,
                'error' => 'This email is already in use',
            ], 422);
        }

        if ($role === 'staff') {
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
            ]);

            $hotel = \App\Models\Hotel::first();
            $hotelId = $hotel ? $hotel->id : 1;

            $staff = Staff::create([
                'user_id' => $user->id,
                'hotel_id' => $hotelId,
                'position' => 'receptionist',
                'hire_date' => now(),
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'email' => $user->email,
                    'role' => 'staff',
                    'id' => $user->id,
                    'display_id' => $staff->display_id,
                    'name' => $user->name,
                    'hotel_id' => $hotelId,
                ],
            ], 201);
        } else {
            $guest = Guest::create([
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
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

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Find or create the guest
            $guest = Guest::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->first();

            if ($guest) {
                // Update existing user if needed
                $guest->update([
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                ]);
            } else {
                // Create new guest
                // Split name if possible
                $nameParts = explode(' ', $googleUser->name, 2);
                $firstName = $nameParts[0] ?? 'Google';
                $lastName = $nameParts[1] ?? 'User';

                $guest = Guest::create([
                    'google_id' => $googleUser->id,
                    'email' => $googleUser->email,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'avatar' => $googleUser->avatar,
                    'password' => null, // Social login users don't need a password initially
                ]);
            }

            $userData = [
                'email' => $guest->email,
                'role' => 'guest',
                'id' => $guest->id,
                'display_id' => $guest->display_id,
                'name' => $guest->first_name . ' ' . $guest->last_name,
                'avatar' => $guest->avatar,
                'hotel_id' => null,
            ];

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            $jsonData = base64_encode(json_encode($userData));
            
            return redirect($frontendUrl . '/auth/google/callback?data=' . $jsonData);

        } catch (\Exception $e) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect($frontendUrl . '/login?error=' . urlencode('Google authentication failed: ' . $e->getMessage()));
        }
    }
}
