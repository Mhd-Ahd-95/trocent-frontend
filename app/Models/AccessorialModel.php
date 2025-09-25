<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccessorialModel extends Model
{
    protected $timestamps = false;

    protected $fillable = [
        'name',
        'type',
        'amount',
        'is_driver',
        'amount_type',
        'min',
        'max',
        'package_type',
        'product_type',
        'free_time',
        'unit_time',
        'base_amount'
    ];
}
