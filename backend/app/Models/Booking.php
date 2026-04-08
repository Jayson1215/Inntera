<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'booking_id';
    protected $table = 'bookings';

    protected $fillable = [
        'booking_reference',
        'guest_id',
        'hotel_id',
        'checkin_date',
        'checkout_date',
        'booking_status',
        'total_cost',
        'notes',
    ];

    protected $casts = [
        'checkin_date' => 'date',
        'checkout_date' => 'date',
        'total_cost' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'booking_id';
    }

    // Relationships
    public function guest()
    {
        return $this->belongsTo(Guest::class, 'guest_id', 'id');
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id', 'id');
    }

    public function bookingRooms()
    {
        return $this->hasMany(BookingRoom::class, 'booking_id', 'booking_id');
    }

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'booking_rooms', 'booking_id', 'room_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'booking_id', 'booking_id');
    }

    public function charges()
    {
        return $this->hasMany(Charge::class, 'booking_id', 'booking_id');
    }

    // Mutators
    public static function generateReference()
    {
        $count = \App\Models\Booking::withTrashed()->count();
        return 'BK-BTU-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);
    }
}
