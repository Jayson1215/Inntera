<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Payment::with('booking.guest');

        if ($request->has('booking_id')) {
            $query->where('booking_id', $request->booking_id);
        }

        $payments = $query->get();

        return response()->json(['success' => true, 'data' => $payments]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,booking_id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:credit_card,debit_card,bank_transfer,gcash,paypal,paymaya',
            'status' => 'in:pending,completed,failed,refunded',
            'transaction_id' => 'nullable|string',
            'payment_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $payment = Payment::create($validated);

        return response()->json(['success' => true, 'data' => $payment], 201);
    }
}
