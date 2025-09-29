<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccessorialModel extends Model
{
    public $timestamps = false;

    protected $table = 'accessorials';

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
        'time_unit',
        'base_amount'
    ];
}
