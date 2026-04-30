<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StaffController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Staff::with(['user', 'hotel']);

        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->hotel_id);
        }

        $staff = $query->get();
        return response()->json(['success' => true, 'data' => $staff]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'hotel_id' => 'required|exists:hotels,id',
            'role' => 'required|string',
        ]);

        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => 'staff',
        ]);

        $staff = Staff::create([
            'user_id' => $user->id,
            'hotel_id' => $request->hotel_id,
            'position' => $request->role,
            'display_id' => 'STF-' . strtoupper(substr(uniqid(), -4)),
            'hire_date' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $staff->load(['user', 'hotel']),
            'message' => 'Staff created successfully'
        ]);
    }
}
