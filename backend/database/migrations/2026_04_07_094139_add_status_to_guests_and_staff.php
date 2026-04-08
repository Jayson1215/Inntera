<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->enum('status', ['active', 'banned'])->default('active')->after('loyalty_member_id');
        });

        Schema::table('staff', function (Blueprint $table) {
            $table->enum('status', ['active', 'suspended'])->default('active')->after('position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('staff', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
