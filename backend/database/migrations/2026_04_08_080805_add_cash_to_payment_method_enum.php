<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE payments MODIFY COLUMN payment_method ENUM('credit_card', 'debit_card', 'bank_transfer', 'gcash', 'paypal', 'paymaya', 'cash') DEFAULT 'credit_card'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE payments MODIFY COLUMN payment_method ENUM('credit_card', 'debit_card', 'bank_transfer', 'gcash', 'paypal', 'paymaya') DEFAULT 'credit_card'");
    }
};
