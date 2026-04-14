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
use App\Http\Controllers\SystemController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AdminController;

// Admin Management
Route::prefix('admin')->group(function () {
    Route::patch('/guests/{id}/ban', [AdminController::class, 'toggleBanGuest']);
    Route::patch('/guests/{id}', [AdminController::class, 'updateGuest']);
    Route::delete('/guests/{id}', [AdminController::class, 'removeGuest']);
    Route::patch('/staff/{id}/suspend', [AdminController::class, 'toggleSuspendStaff']);
    Route::patch('/staff/{id}', [AdminController::class, 'updateStaff']);
    Route::delete('/staff/{id}', [AdminController::class, 'removeStaff']);
});

// System Init
Route::get('/system/init', [SystemController::class, 'init']);

// Notifications
Route::get('/notifications', [NotificationController::class, 'index']);
Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/signup', [AuthController::class, 'signup']);
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

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
