<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'account_number',
        'name',
        'address',
        'suite',
        'city',
        'province',
        'postal_code',
        'account_contact',
        'phone_number',
        'fax_number',
        'terms_of_payment',
        'weight_pieces_rule',
        'fuel_surcharge_rule',
        'opening_date',
        'last_invoice_date',
        'last_payment_date',
        'credit_limit',
        'account_balance',
        'language',
        'invoicing',
        'logo_path',
        'filename',
        'filesize',
        'account_active',
        'mandatory_reference_number',
        'summary_invoice',
        'receive_status_update',
        'include_pod_with_invoice',
        'fuel_ltl',
        'fuel_ftl',
        'fuel_ltl_other',
        'fuel_ftl_other',
        'fuel_ltl_other_value',
        'fuel_ftl_other_value',
        'billing_emails',
        'pod_emails',
        'status_update_emails',
        'notification_preferences',
        'tax_options'
    ];

    protected $casts = [
        'receive_status_update' => 'boolean',
        'mandatory_reference_number' => 'boolean',
        'include_pod_with_invoice' => 'boolean',
        'summary_invoice' => 'boolean',
        'fuel_ltl_other' => 'boolean',
        'fuel_ftl_other' => 'boolean',
        'billing_emails' => 'array',
        'pod_emails' => 'array',
        'status_update_emails' => 'array',
        'notification_preferences' => 'array',
        'opening_date' => 'date',
        'last_invoice_date' => 'date',
        'last_payment_date' => 'date',
    ];

    public function accessorials()
    {
        return $this->belongsToMany(AccessorialModel::class, 'accessorials_customer', 'customer_id', 'access_id')->withPivot([
            'id',
            'amount',
            'min',
            'max',
            'free_time',
            'base_amount'
        ]);
    }

    public function vehicleTypes()
    {
        return $this->belongsToMany(VehicleType::class, 'vehicle_types_customer', 'customer_id', 'vehicle_id')->withPivot([
            'id',
            'rate'
        ]);
    }

    public function rateSheets(){
        return $this->hasMany(RateSheet::class, 'customer_id');
    }

}
