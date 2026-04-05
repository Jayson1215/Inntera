<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Staff extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'id';
    protected $table = 'staff';

    protected $appends = ['role', 'name'];

    /**
     * Auto-eager-load `user` to prevent N+1 queries
     * triggered by the `name` accessor during serialization.
     */
    protected $with = ['user'];

    protected $fillable = [
        'display_id',
        'user_id',
        'hotel_id',
        'position',
        'hire_date',
    ];

    protected $casts = [
        'hire_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id', 'id');
    }

    public function getRoleAttribute()
    {
        return $this->position;
    }

    public function getNameAttribute()
    {
        return $this->user ? $this->user->name : 'Unknown';
    }
}
