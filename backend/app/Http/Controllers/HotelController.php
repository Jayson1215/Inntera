<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HotelController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Hotel::query();

        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        $hotels = $query->withCount(['rooms', 'bookings'])
            ->with('roomTypes')
            ->get();

        return response()->json(['success' => true, 'data' => $hotels]);
    }

    public function show(Hotel $hotel): JsonResponse
    {
        $hotel->load(['roomTypes.amenities', 'roomTypes.rates', 'rooms.roomType', 'staff.user']);

        return response()->json(['success' => true, 'data' => $hotel]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'phone' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'star_rating' => 'nullable|integer|min:1|max:5',
        ]);

        $hotel = Hotel::create($validated);

        return response()->json(['success' => true, 'data' => $hotel], 201);
    }

    public function update(Request $request, Hotel $hotel): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'sometimes|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'phone' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'star_rating' => 'nullable|integer|min:1|max:5',
            'total_rooms' => 'sometimes|integer|min:0',
            'available_rooms' => 'sometimes|integer|min:0',
        ]);

        $updateData = array_filter($validated, function($value) {
            return $value !== null && $value !== '';
        });

        $hotel->update($updateData);

        return response()->json(['success' => true, 'data' => $hotel->fresh()]);
    }

    public function destroy(Hotel $hotel): JsonResponse
    {
        $hotel->delete();

        return response()->json(['success' => true, 'message' => 'Hotel deleted']);
    }
}
