<?php

namespace Database\Seeders;

use App\Models\Widget;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = Permission::all();
        $widgets = Widget::all();
        $role_admin = Role::create(['name' => 'Admin', 'guard_name' => 'api'])->givePermissionTo($permissions);
        $role_admin->widgets()->attach($widgets->pluck('id'));
        Role::create(['name' => 'Power User', 'guard_name' => 'api'])->givePermissionTo(['create_order', 'create_customer', 'update_order']);
        Role::create(['name' => 'Rating', 'guard_name' => 'api'])->givePermissionTo(['create_order', 'create_customer', 'update_order']);
    }
}
