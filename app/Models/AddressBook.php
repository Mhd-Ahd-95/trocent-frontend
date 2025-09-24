<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AddressBook extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'name',
        'contact_name',
        'phone_number',
        'email',
        'address',
        'suite',
        'city',
        'province',
        'postal_code',
        'special_instructions',
        'op_time_from',
        'op_time_to',
        'requires_appointment',
        'no_waiting_time'
    ];
}
