<?php

namespace App\Http\Controllers;

use App\Http\Traits\FiltersFillableData;
use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GuestController extends Controller
{
    use FiltersFillableData;

    /**
     * List guests with booking count.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Guest::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $guests = $query->withCount('bookings')->get();

        return response()->json(['success' => true, 'data' => $guests]);
    }

    /**
     * Show a single guest with booking history.
     */
    public function show(Guest $guest): JsonResponse
    {
        $guest->load([
            'bookings.hotel:id,name',
            'bookings.bookingRooms.room:room_id,room_number,floor',
        ]);

        return response()->json(['success' => true, 'data' => $guest]);
    }

    /**
     * Create a new guest.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:guests,email',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'loyalty_member_id' => 'nullable|string|max:255',
        ]);

        $guest = Guest::create($validated);

        return response()->json(['success' => true, 'data' => $guest], 201);
    }

    /**
     * Update a guest.
     */
    public function update(Request $request, Guest $guest): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:guests,email,' . $guest->id . ',id',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'loyalty_member_id' => 'nullable|string|max:255',
        ]);

        $guest->update($this->filterUpdateData($validated));

        return response()->json(['success' => true, 'data' => $guest->refresh()]);
    }
}
