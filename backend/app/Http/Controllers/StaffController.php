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
}
