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
        Schema::create('accessorials', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->enum('type', ['fixed_price', 'fuel_based', 'time_based', 'transport_based', 'product_base', 'package_based']);
            $table->float('amount')->nullable();
            $table->boolean('is_driver')->default(false);
            $table->float('min')->nullable();
            $table->float('max')->nullable();
            $table->string('package_type')->nullable();
            $table->string('product_type')->nullable();
            $table->float('free_time')->nullable();
            $table->enum('time_unit', ['minute', 'hour'])->nullable();
            $table->float('base_amount')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accessorials');
    }
};
