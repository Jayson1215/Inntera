<?php

namespace App\Http\Controllers;

use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoomTypeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = RoomType::with(['hotel', 'amenities', 'rates']);

        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->hotel_id);
        }

        $roomTypes = $query->withCount('rooms')->get();

        return response()->json(['success' => true, 'data' => $roomTypes]);
    }

    public function show(RoomType $roomType): JsonResponse
    {
        $roomType->load(['hotel', 'amenities', 'rates', 'rooms']);

        return response()->json(['success' => true, 'data' => $roomType]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'max_occupancy' => 'required|integer|min:1',
            'status' => 'in:active,inactive',
        ]);

        $roomType = RoomType::create($validated);

        return response()->json(['success' => true, 'data' => $roomType], 201);
    }

    public function update(Request $request, RoomType $roomType): JsonResponse
    {
        $validated = $request->validate([
            'hotel_id' => 'sometimes|exists:hotels,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'base_price' => 'sometimes|numeric|min:0',
            'max_occupancy' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $updateData = array_filter($validated, function($value) {
            return $value !== null && $value !== '';
        });

        $roomType->update($updateData);

        return response()->json(['success' => true, 'data' => $roomType->fresh()]);
    }
}
