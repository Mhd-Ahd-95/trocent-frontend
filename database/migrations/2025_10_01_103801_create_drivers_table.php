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
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('driver_number')->unique();
            $table->string('fname');
            $table->string('mname')->nullable();
            $table->string('lname');
            $table->date('dob')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->string('sin')->nullable();
            $table->foreignId('company_id')->constrained('companies', 'id')->cascadeOnDelete();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('suite')->nullable();
            $table->string('license_number')->nullable();
            $table->string('license_classes')->nullable();
            $table->date('license_expiry')->nullable();
            $table->boolean('tdg')->default(false);
            $table->date('tdg_expiry')->nullable();
            $table->date('criminal_expiry')->nullable();
            $table->string('criminal_note')->nullable();
            $table->enum('contract_type', ['full_time', 'part_time', 'contractor'])->nullable();
            $table->string('driver_description')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users', 'id')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
