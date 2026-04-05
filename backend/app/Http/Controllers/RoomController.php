<?php

namespace App\Http\Controllers;

use App\Http\Traits\FiltersFillableData;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoomController extends Controller
{
    use FiltersFillableData;

    /**
     * List rooms with selective eager loading.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Room::with([
            'hotel:id,name',
            'roomType:room_type_id,name,base_price,bed_type',
        ]);

        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->hotel_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('room_type_id')) {
            $query->where('room_type_id', $request->room_type_id);
        }

        $rooms = $query->get();

        return response()->json(['success' => true, 'data' => $rooms]);
    }

    /**
     * Show a single room with full details.
     */
    public function show(Room $room): JsonResponse
    {
        $room->load(['hotel', 'roomType', 'bookingRooms.booking']);

        return response()->json(['success' => true, 'data' => $room]);
    }

    /**
     * Create a new room.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'status' => 'in:available,occupied,maintenance,reserved',
            'notes' => 'nullable|string',
        ]);

        $room = Room::create($validated);

        return response()->json([
            'success' => true,
            'data' => $room->load(['hotel:id,name', 'roomType:room_type_id,name']),
        ], 201);
    }

    /**
     * Update a room.
     */
    public function update(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'hotel_id' => 'sometimes|exists:hotels,id',
            'room_type_id' => 'sometimes|exists:room_types,room_type_id',
            'room_number' => 'sometimes|string|max:255',
            'floor' => 'sometimes|string',
            'status' => 'sometimes|in:available,occupied,maintenance,reserved',
            'notes' => 'nullable|string',
        ]);

        $room->update($this->filterUpdateData($validated));

        return response()->json([
            'success' => true,
            'data' => $room->refresh()->load(['hotel:id,name', 'roomType:room_type_id,name']),
        ]);
    }

    /**
     * Update room status only.
     */
    public function updateStatus(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:available,occupied,maintenance,reserved,cleaning',
        ]);

        $room->update($validated);

        return response()->json(['success' => true, 'data' => $room->refresh()]);
    }
}
