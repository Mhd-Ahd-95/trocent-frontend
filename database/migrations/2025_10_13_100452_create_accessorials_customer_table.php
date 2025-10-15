<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('accessorials_customer', function (Blueprint $table) {
            $table->id();
            $table->foreignId('access_id')->constrained('accessorials')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->decimal('amount', 8, 2)->nullable();
            $table->integer('free_time')->nullable();
            $table->decimal('base_amount', 8, 2)->nullable();
            $table->decimal('min', 8, 2)->nullable();
            $table->decimal('max', 8, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accessorials_customer');
    }
};
