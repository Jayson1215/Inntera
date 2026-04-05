<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Guest extends Authenticatable
{
    use SoftDeletes, Notifiable;

    protected static function booted()
    {
        static::creating(function ($guest) {
            if (empty($guest->display_id)) {
                $guest->display_id = 'GST-' . strtoupper(Str::random(6));
            }
        });
    }

    protected $primaryKey = 'id';
    protected $table = 'guests';

    protected $fillable = [
        'display_id',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'password',
        'phone',
        'address',
        'loyalty_member_id',
    ];

    protected $hidden = [
        'password',
    ];

    public function getRouteKeyName(): string
    {
        return 'id';
    }

    // Relationships
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'guest_id', 'id');
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}
