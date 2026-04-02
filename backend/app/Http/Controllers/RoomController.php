<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoomController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Room::with(['hotel', 'roomType']);

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

    public function show(Room $room): JsonResponse
    {
        $room->load(['hotel', 'roomType', 'bookingRooms.booking']);

        return response()->json(['success' => true, 'data' => $room]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'status' => 'in:available,occupied,maintenance,reserved',
            'notes' => 'nullable|string',
        ]);

        $room = Room::create($validated);

        return response()->json(['success' => true, 'data' => $room->load(['hotel', 'roomType'])], 201);
    }

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

        $updateData = array_filter($validated, function($value) {
            return $value !== null && $value !== '';
        });

        $room->update($updateData);

        return response()->json(['success' => true, 'data' => $room->fresh()->load(['hotel', 'roomType'])]);
    }

    public function updateStatus(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:available,occupied,maintenance,reserved,cleaning',
        ]);

        $room->update($validated);

        return response()->json(['success' => true, 'data' => $room->fresh()]);
    }
}
