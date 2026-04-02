<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HotelController extends Controller
{
    /**
     * Get all hotels
     */
    public function index()
    {
        $hotels = Hotel::with(['roomTypes', 'rooms'])->get();
        
        return response()->json([
            'success' => true,
            'data' => $hotels,
            'message' => 'Hotels retrieved successfully'
        ]);
    }

    /**
     * Get hotel by ID
     */
    public function show($hotelId)
    {
        $hotel = Hotel::with(['roomTypes.amenities', 'rooms', 'staff'])->findOrFail($hotelId);
        
        return response()->json([
            'success' => true,
            'data' => $hotel,
            'message' => 'Hotel retrieved successfully'
        ]);
    }

    /**
     * Create a new hotel
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'star_rating' => 'nullable|integer|min:1|max:5',
        ]);

        $hotel = Hotel::create($validated);

        return response()->json([
            'success' => true,
            'data' => $hotel,
            'message' => 'Hotel created successfully'
        ], Response::HTTP_CREATED);
    }

    /**
     * Update a hotel
     */
    public function update(Request $request, $hotelId)
    {
        $hotel = Hotel::findOrFail($hotelId);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'sometimes|required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'phone' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|max:255',
            'star_rating' => 'nullable|integer|min:1|max:5',
        ]);

        $hotel->update($validated);

        return response()->json([
            'success' => true,
            'data' => $hotel,
            'message' => 'Hotel updated successfully'
        ]);
    }

    /**
     * Delete a hotel
     */
    public function destroy($hotelId)
    {
        $hotel = Hotel::findOrFail($hotelId);
        $hotel->delete();

        return response()->json([
            'success' => true,
            'message' => 'Hotel deleted successfully'
        ]);
    }
}
