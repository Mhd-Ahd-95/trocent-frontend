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
        Schema::create('rate_sheets', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['skid', 'weight']);
            $table->string('destination');
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('rate_code')->nullable();
            $table->string('priority_sequence')->nullable();
            $table->enum('external', ['internal', 'external'])->nullable();
            $table->float('min_rate')->nullable();
            $table->boolean('skid_by_weight')->default(false);
            $table->float('ltl_rate')->nullable();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->string('batch_id')->nullable()->index();
            $table->index(
                ['customer_id', 'destination', 'rate_code', 'type'],
                'rate_sheets_multi_index'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rate_sheets');
    }
};
