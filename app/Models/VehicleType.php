<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleType extends Model
{
    protected $table = 'vehicleTypes';
    protected $fillable = ['name', 'rate'];

}
