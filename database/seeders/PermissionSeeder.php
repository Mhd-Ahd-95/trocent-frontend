<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $parents = ['order', 'customer', 'company', 'user', 'role', 'interliner', 'driver', 'fuel_surcharge', 'rate_sheet', 'accessorial', 'address_book', 'vehicle_type'];

        $permissions = [
            'view',
            'view_any',
            'create',
            'update',
            // 'restore',
            // 'restore_any',
            // 'replicate',
            // 'reorder',
            'delete',
            'delete_any',
            // 'force_delete',
            // 'force_delete_any',
        ];

        $collect_data = [];

        foreach ($parents as $parent) {
            $map_permissions = collect($permissions)->map(function ($permission) use ($parent) {
                return ['name' => $permission . '_' . $parent, 'guard_name' => 'api'];
            });
            $collect_data = [...$collect_data, ...$map_permissions->toArray()];
        }
        ;
        // dd($collect_data);
        Permission::truncate();
        Permission::insert($collect_data);

    }
}
