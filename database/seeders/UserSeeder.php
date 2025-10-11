<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Hash;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::findByName('Admin', 'api');
        User::create([
            'name' => 'IAM',
            'username' => 'admin',
            'type' => 'admin',
            'email' => 'admin@trocent.com',
            'password' => Hash::make('12345678')
        ])->assignRole($role->name);

        User::create([
            'name' => 'IAM Staff',
            'username' => 'staff',
            'type' => 'staff',
            'email' => 'staff@trocent.com',
            'password' => Hash::make('12345678')
        ])->assignRole('Power User');

         User::create([
            'name' => 'IAM Customer',
            'username' => 'customer',
            'type' => 'customer',
            'email' => 'customer@trocent.com',
            'password' => Hash::make('12345678')
        ])->assignRole('Rating');
    }
}
