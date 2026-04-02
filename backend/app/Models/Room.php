<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'room_id';
    protected $table = 'rooms';

    protected $fillable = [
        'hotel_id',
        'room_type_id',
        'room_number',
        'floor',
        'status',
        'notes',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'room_id';
    }

    // Relationships
    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id', 'id');
    }

    public function roomType()
    {
        return $this->belongsTo(RoomType::class, 'room_type_id', 'room_type_id');
    }

    public function bookingRooms()
    {
        return $this->hasMany(BookingRoom::class, 'room_id', 'room_id');
    }

    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_rooms', 'room_id', 'booking_id');
    }
}
