<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverDocument extends Model
{
    protected $fillable = [
        'type',
        'file_path',
        'expiry_date',
        'driver_id'
    ];


    public function driver(){
        return $this->belongsTo(Driver::class, 'driver_id');
    }
}
