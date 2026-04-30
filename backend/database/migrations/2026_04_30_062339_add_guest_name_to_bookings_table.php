<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('guest_name')->nullable()->after('guest_id');
        });

        // Populate existing bookings with guest names
        DB::statement("
            UPDATE bookings 
            JOIN guests ON bookings.guest_id = guests.id 
            SET bookings.guest_name = CONCAT(guests.first_name, ' ', guests.last_name)
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('guest_name');
        });
    }
};
