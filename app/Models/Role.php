<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission;
use \Spatie\Permission\Models\Role as RoleSpatie;

class Role extends RoleSpatie
{
    public function widgets()
    {
        return $this->belongsToMany(Widget::class, 'role_widget', 'role_id', 'widget_id');
    }

    // overriding
    // public function permissions(){
    //     return $this->belongsToMany(Permission::class, 'role_has_permissions');
    // }

}
