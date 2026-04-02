<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\RateController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ChargeController;

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/signup', [AuthController::class, 'signup']);

// Dashboard
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

// Hotels
Route::apiResource('hotels', HotelController::class);

// Rooms
Route::apiResource('rooms', RoomController::class)->except(['destroy']);
Route::patch('/rooms/{room}/status', [RoomController::class, 'updateStatus']);

// Room Types
Route::apiResource('room-types', RoomTypeController::class)->except(['destroy']);

// Bookings
Route::apiResource('bookings', BookingController::class)->except(['destroy']);
Route::patch('/bookings/{booking}/status', [BookingController::class, 'updateStatus']);

// Guests
Route::apiResource('guests', GuestController::class)->except(['destroy']);

// Rates
Route::apiResource('rates', RateController::class)->except(['destroy']);

// Amenities
Route::get('/amenities', [AmenityController::class, 'index']);

// Staff
Route::get('/staff', [StaffController::class, 'index']);

// Payments
Route::get('/payments', [PaymentController::class, 'index']);
Route::post('/payments', [PaymentController::class, 'store']);

// Charges
Route::get('/charges', [ChargeController::class, 'index']);
Route::post('/charges', [ChargeController::class, 'store']);
