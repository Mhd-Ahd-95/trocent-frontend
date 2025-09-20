<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

class Widget extends Model
{
    protected $fillable = ['name'];

    public function roles(){
        return $this->belongsToMany(Role::class, 'role_widget');
    }
}
