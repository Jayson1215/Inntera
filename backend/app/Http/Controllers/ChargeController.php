<?php

namespace App\Http\Controllers;

use App\Models\Charge;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChargeController extends Controller
{
    /**
     * List charges with selective eager loading.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Charge::with('booking:booking_id,guest_id,booking_reference');

        if ($request->has('booking_id')) {
            $query->where('booking_id', $request->booking_id);
        }

        $charges = $query->get();

        return response()->json(['success' => true, 'data' => $charges]);
    }

    /**
     * Create a new charge.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,booking_id',
            'charge_type' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $charge = Charge::create($validated);

        return response()->json(['success' => true, 'data' => $charge], 201);
    }
}
