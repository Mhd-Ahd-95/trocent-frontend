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
        Schema::create('rate_sheet_brackets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rate_sheet_id')->constrained('rate_sheets')->cascadeOnDelete();
            $table->float('rate_bracket');
            $table->float('rate')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rate_sheet_brackets');
    }
};
