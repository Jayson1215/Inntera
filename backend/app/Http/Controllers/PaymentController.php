<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Booking;
use App\Models\User;
use App\Notifications\BookingStatusNotification;
use Illuminate\Support\Facades\Notification;

class PaymentController extends Controller
{
    /**
     * List payments with selective eager loading.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Payment::with('booking:booking_id,guest_id,booking_reference');

        if ($request->has('booking_id')) {
            $query->where('booking_id', $request->booking_id);
        }

        $payments = $query->get();

        return response()->json(['success' => true, 'data' => $payments]);
    }

    /**
     * Create a new payment.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,booking_id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:credit_card,debit_card,bank_transfer,gcash,paypal,paymaya,cash',
            'status' => 'in:pending,completed,failed,refunded',
            'transaction_id' => 'nullable|string',
            'payment_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $payment = Payment::create($validated);
        $booking = $payment->booking;

        if ($booking) {
            $method = ucfirst($payment->payment_method);
            $amount = number_format($payment->amount, 2);
            
            // 1. Notify Guest
            if ($booking->guest) {
                $booking->guest->notify(new BookingStatusNotification(
                    $booking,
                    'payment_received',
                    'Payment Received',
                    "Your payment of ₱{$amount} via {$method} has been received."
                ));
            }

            // 2. Notify Staff and Admin
            $staff = User::whereIn('role', ['admin', 'staff'])->get();
            if ($staff->isNotEmpty()) {
                Notification::send($staff, new BookingStatusNotification(
                    $booking,
                    'payment_recorded',
                    'Payment Logged',
                    "{$method} payment of ₱{$amount} recorded for {$booking->booking_reference}."
                ));
            }
        }

        return response()->json(['success' => true, 'data' => $payment], 201);
    }
}
