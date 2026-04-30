<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomType extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'room_type_id';
    protected $table = 'room_types';

    protected $fillable = [
        'hotel_id',
        'name',
        'description',
        'base_price',
        'max_occupancy',
        'status',
        'bed_type',
        'image_url',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'room_type_id';
    }

    // Relationships
    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id', 'id');
    }

    public function rooms()
    {
        return $this->hasMany(Room::class, 'room_type_id', 'room_type_id');
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'room_amenities', 'room_type_id', 'amenity_id');
    }

    public function rates()
    {
        return $this->hasMany(Rate::class, 'room_type_id', 'room_type_id');
    }
}
