<?php

namespace App\Http\Controllers;

use App\Models\Amenity;
use Illuminate\Http\JsonResponse;

class AmenityController extends Controller
{
    public function index(): JsonResponse
    {
        $amenities = Amenity::all();

        return response()->json(['success' => true, 'data' => $amenities]);
    }
}
