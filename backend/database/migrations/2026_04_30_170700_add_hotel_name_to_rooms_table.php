<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->string('hotel_name')->nullable()->after('hotel_id');
        });

        // Populate existing data
        DB::table('rooms')->get()->each(function ($room) {
            $hotel = DB::table('hotels')->where('id', $room->hotel_id)->first();
            if ($hotel) {
                DB::table('rooms')->where('room_id', $room->room_id)->update(['hotel_name' => $hotel->name]);
            } else {
                DB::table('rooms')->where('room_id', $room->room_id)->update(['hotel_name' => 'Unknown Hotel']);
            }
        });

        // Set to NOT NULL
        DB::statement('ALTER TABLE rooms MODIFY hotel_name VARCHAR(255) NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn('hotel_name');
        });
    }
};
