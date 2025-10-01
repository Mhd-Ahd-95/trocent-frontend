<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $fillable = [
        'driver_number',
        'fname',
        'mname',
        'lname',
        'dob',
        'gender',
        'sin',
        'phone',
        'email',
        'address',
        'city',
        'province',
        'suite',
        'postal_code',
        'license_number',
        'license_classes',
        'license_expiry',
        'tdg',
        'tdg_expiry',
        'criminal_expiry',
        'criminal_note',
        'contract_type',
        'driver_description',
        'company_id'
    ];

    public function driver_documents()
    {
        return $this->hasMany(DriverDocument::class, 'driver_id', 'id');
    }

    public function company(){
       return $this->belongsTo(Company::class, 'comapny_id');
    }
}
