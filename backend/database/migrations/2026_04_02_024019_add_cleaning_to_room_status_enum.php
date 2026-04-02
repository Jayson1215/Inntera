<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE rooms MODIFY COLUMN status ENUM('available', 'occupied', 'maintenance', 'reserved', 'cleaning') DEFAULT 'available'");
    }

    public function down(): void
    {
        DB::statement("UPDATE rooms SET status = 'maintenance' WHERE status = 'cleaning'");
        DB::statement("ALTER TABLE rooms MODIFY COLUMN status ENUM('available', 'occupied', 'maintenance', 'reserved') DEFAULT 'available'");
    }
};
