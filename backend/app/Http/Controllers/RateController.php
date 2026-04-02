<?php

namespace App\Http\Controllers;

use App\Models\Rate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Rate::with('roomType.hotel');

        if ($request->has('room_type_id')) {
            $query->where('room_type_id', $request->room_type_id);
        }

        if ($request->has('hotel_id')) {
            $query->whereHas('roomType', function ($q) use ($request) {
                $q->where('hotel_id', $request->hotel_id);
            });
        }

        $rates = $query->get();

        return response()->json(['success' => true, 'data' => $rates]);
    }

    public function show(Rate $rate): JsonResponse
    {
        $rate->load('roomType.hotel');

        return response()->json(['success' => true, 'data' => $rate]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'room_type_id' => 'required|exists:room_types,room_type_id',
            'price' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'season' => 'in:low,regular,high,peak',
        ]);

        $rate = Rate::create($validated);

        return response()->json(['success' => true, 'data' => $rate], 201);
    }

    public function update(Request $request, Rate $rate): JsonResponse
    {
        $validated = $request->validate([
            'room_type_id' => 'sometimes|exists:room_types,room_type_id',
            'price' => 'sometimes|numeric|min:0',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'season' => 'sometimes|in:low,regular,high,peak',
        ]);

        $updateData = array_filter($validated, function($value) {
            return $value !== null && $value !== '';
        });

        $rate->update($updateData);

        return response()->json(['success' => true, 'data' => $rate->fresh()]);
    }
}
