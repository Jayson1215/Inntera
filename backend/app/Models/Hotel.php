<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hotel extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'id';
    protected $table = 'hotels';

    protected $fillable = [
        'display_id',
        'name',
        'description',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'phone',
        'email',
        'total_rooms',
        'available_rooms',
        'star_rating',
        'image_url',
        'opens_at',
        'closes_at',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'id';
    }

    // Relationships
    public function rooms()
    {
        return $this->hasMany(Room::class, 'hotel_id', 'id');
    }

    public function roomTypes()
    {
        return $this->hasMany(RoomType::class, 'hotel_id', 'id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'hotel_id', 'id');
    }

    public function staff()
    {
        return $this->hasMany(Staff::class, 'hotel_id', 'id');
    }
}
