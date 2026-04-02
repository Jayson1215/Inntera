<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Amenity extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'amenity_id';
    protected $table = 'amenities';

    protected $fillable = [
        'name',
        'description',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function roomTypes()
    {
        return $this->belongsToMany(RoomType::class, 'room_amenities', 'amenity_id', 'room_type_id');
    }
}
