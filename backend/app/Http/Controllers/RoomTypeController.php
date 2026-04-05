<?php

namespace App\Http\Controllers;

use App\Http\Traits\FiltersFillableData;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoomTypeController extends Controller
{
    use FiltersFillableData;

    /**
     * List room types with selective eager loading.
     */
    public function index(Request $request): JsonResponse
    {
        $query = RoomType::with([
            'hotel:id,name',
            'amenities:amenity_id,name',
            'rates:rate_id,room_type_id,price,start_date,end_date,season',
        ]);

        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->hotel_id);
        }

        $roomTypes = $query->withCount('rooms')->get();

        return response()->json(['success' => true, 'data' => $roomTypes]);
    }

    /**
     * Show a single room type with full details.
     */
    public function show(RoomType $roomType): JsonResponse
    {
        $roomType->load(['hotel', 'amenities', 'rates', 'rooms']);

        return response()->json(['success' => true, 'data' => $roomType]);
    }

    /**
     * Create a new room type.
     */
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

    /**
     * Update a room type.
     */
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

        $roomType->update($this->filterUpdateData($validated));

        return response()->json(['success' => true, 'data' => $roomType->refresh()]);
    }
}
