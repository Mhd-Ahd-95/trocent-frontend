<?php

namespace Database\Seeders;

use App\Models\VehicleType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vtypes = [
            ['name' => 'Car-1', 'rate' => 5.5],
            ['name' => 'Car-2', 'rate' => 7.5],
            ['name' => 'Car-3', 'rate' => 15.5],
            ['name' => 'Car-4', 'rate' => 22.25],
            ['name' => 'Car-5', 'rate' => 10]
        ];

        VehicleType::insert($vtypes);
    }
}
