<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FuelSurcharge extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'ltl_surcharge',
        'ftl_surcharge',
        'from_date',
        'to_date'
    ];
}
