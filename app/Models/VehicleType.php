<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleType extends Model
{
    protected $table = 'vehicleTypes';
    protected $fillable = ['name', 'rate'];

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'vehicle_types_customer', 'vehicle_id', 'customer_id')->withPivot([
            'id',
            'rate'
        ]);
    }

}
