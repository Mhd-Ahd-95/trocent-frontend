<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverDocument extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'type',
        'file_path',
        'expiry_date',
        'fname',
        'fsize',
        'driver_id'
    ];


    public function driver(){
        return $this->belongsTo(Driver::class, 'driver_id');
    }
}
