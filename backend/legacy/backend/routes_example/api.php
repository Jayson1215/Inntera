<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StaffController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Hotel & Room Browsing
Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{hotelId}', [HotelController::class, 'show']);
Route::get('/hotels/{hotelId}/rooms', [RoomController::class, 'byHotel']);
Route::get('/rooms/{roomId}', [RoomController::class, 'show']);

// Protected Routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Current User
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);

    // Guest Profile
    Route::get('/guests/{guestId}', [GuestController::class, 'show']);
    Route::put('/guests/{guestId}', [GuestController::class, 'update']);

    // Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'userBookings']);
    Route::get('/bookings/{bookingId}', [BookingController::class, 'show']);
    Route::put('/bookings/{bookingId}', [BookingController::class, 'update']);
    Route::delete('/bookings/{bookingId}', [BookingController::class, 'destroy']);

    // Payments
    Route::get('/bookings/{bookingId}/payments', [PaymentController::class, 'byBooking']);
    Route::post('/payments', [PaymentController::class, 'store']);

    // Admin Routes
    Route::middleware('can:admin')->group(function () {
        // Hotel Management
        Route::post('/hotels', [HotelController::class, 'store']);
        Route::put('/hotels/{hotelId}', [HotelController::class, 'update']);
        Route::delete('/hotels/{hotelId}', [HotelController::class, 'destroy']);

        // Room Management
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::put('/rooms/{roomId}', [RoomController::class, 'update']);
        Route::delete('/rooms/{roomId}', [RoomController::class, 'destroy']);

        // Guest Management
        Route::get('/guests', [GuestController::class, 'index']);
        Route::post('/guests', [GuestController::class, 'store']);
        Route::delete('/guests/{guestId}', [GuestController::class, 'destroy']);

        // All Bookings
        Route::get('/admin/bookings', [BookingController::class, 'allBookings']);

        // Admin Dashboard
        Route::get('/admin/stats', [AdminController::class, 'stats']);
        Route::get('/admin/reports', [AdminController::class, 'reports']);

        // Staff Management
        Route::get('/staff', [StaffController::class, 'index']);
        Route::post('/staff', [StaffController::class, 'store']);
        Route::put('/staff/{staffId}', [StaffController::class, 'update']);
        Route::delete('/staff/{staffId}', [StaffController::class, 'destroy']);
    });

    // Staff Routes
    Route::middleware('can:staff')->group(function () {
        Route::get('/staff/dashboard', [StaffController::class, 'dashboard']);
        Route::get('/staff/bookings', [BookingController::class, 'hotelBookings']);
        Route::put('/staff/bookings/{bookingId}/checkin', [BookingController::class, 'checkin']);
        Route::put('/staff/bookings/{bookingId}/checkout', [BookingController::class, 'checkout']);
    });
});

// Health Check
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
