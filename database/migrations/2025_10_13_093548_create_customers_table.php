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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('account_number')->unique();
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('suite')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('account_contact')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('fax_number')->nullable();
            $table->string('terms_of_payment')->nullable();
            $table->string('weight_pieces_rule')->nullable();
            $table->string('fuel_surcharge_rule')->nullable();
            $table->date('opening_date')->nullable();
            $table->date('last_invoice_date')->nullable();
            $table->date('last_payment_date')->nullable();
            $table->float('credit_limit')->nullable();
            $table->float('account_balance')->nullable();
            $table->enum('language', ['en', 'fr'])->nullable();
            $table->enum('invoicing', ['daily', 'weekly', 'monthly'])->nullable();
            $table->string('logo_path')->nullable();
            $table->string('filename')->nullable();
            $table->string('filesize')->nullable();
            $table->boolean('account_active')->default(false);
            $table->boolean('mandatory_reference_number')->default(false);
            $table->boolean('summary_invoice')->default(false);
            // $table->boolean('no_tax')->default(false);
            $table->boolean('receive_status_update')->default(false);
            $table->boolean('include_pod_with_invoice')->default(false);
            $table->float('fuel_ltl');
            $table->float('fuel_ftl');
            $table->boolean('fuel_ltl_other')->default(false);
            $table->boolean('fuel_ftl_other')->default(false);
            $table->float('fuel_ltl_other_value')->nullable();
            $table->float('fuel_ftl_other_value')->nullable();
            $table->json('billing_emails')->nullable();
            $table->json('pod_emails')->nullable();
            $table->json('status_update_emails')->nullable();
            $table->json('notification_preferences')->nullable();
            $table->enum('tax_options', ['no_tax', 'pst', 'gst', 'both_pst_gst'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
