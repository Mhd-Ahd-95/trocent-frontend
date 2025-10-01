<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interliner extends Model
{
    protected $fillable = [
        'name',
        'contact_name',
        'phone',
        'email',
        'address',
        'suite',
        'city',
        'province',
        'postal_code'
    ];
}
