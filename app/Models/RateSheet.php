<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RateSheet extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'type',
        'destination',
        'postal_code',
        'province',
        'rate_code',
        'priority_sequence',
        'external',
        'min_rate',
        'skid_by_weight',
        'ltl_rate',
        'customer_id',
        'batch_id'
    ];

    public function brackets()
    {
        return $this->hasMany(RateSheetBracket::class, 'rate_sheet_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
}
