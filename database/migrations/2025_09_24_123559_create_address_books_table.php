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
        Schema::create('address_books', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('contact_name')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();
            $table->string('address');
            $table->string('suite');
            $table->string('city');
            $table->string('province');
            $table->string('postal_code');
            $table->text('special_instructions');
            $table->time('op_time_from')->nullable();
            $table->time('op_time_to')->nullable();
            $table->boolean('requires_appointment')->default(false);
            $table->boolean('no_waiting_time')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('address_books');
    }
};
