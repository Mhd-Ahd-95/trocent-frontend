<?php

namespace Database\Seeders;

use App\Models\AccessorialModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccessorialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accessorials = [
            [
                'name' => 'Fixed Price Charge 1',
                'type' => 'fixed_price',
                'amount' => 100,
                'is_driver' => false,
                'amount_type' => null,
                'min' => null,
                'max' => null,
                'package_type' => null,
                'product_type' => null,
                'free_time' => null,
                'time_unit' => null,
                'base_amount' => null,
            ],
            [
                'name' => 'Fuel Charge 1',
                'type' => 'fuel_based',
                'amount' => 50,
                'is_driver' => false,
                'amount_type' => 'percentage',
                'min' => 10,
                'max' => 100,
                'package_type' => null,
                'product_type' => null,
                'free_time' => null,
                'time_unit' => null,
                'base_amount' => null,
            ],
            [
                'name' => 'Package Charge 1',
                'type' => 'package_based',
                'amount' => 30,
                'is_driver' => false,
                'amount_type' => null,
                'min' => null,
                'max' => null,
                'package_type' => 'box',
                'product_type' => null,
                'free_time' => null,
                'time_unit' => null,
                'base_amount' => null,
            ],
            [
                'name' => 'Product Charge 1',
                'type' => 'product_base',
                'amount' => 60,
                'is_driver' => false,
                'amount_type' => null,
                'min' => null,
                'max' => null,
                'package_type' => null,
                'product_type' => 'carton',
                'free_time' => null,
                'time_unit' => null,
                'base_amount' => null,
            ],
            [
                'name' => 'Time Charge 1',
                'type' => 'time_based',
                'amount' => 15,
                'is_driver' => false,
                'amount_type' => null,
                'min' => null,
                'max' => null,
                'package_type' => null,
                'product_type' => null,
                'free_time' => 30,
                'time_unit' => 'minute',
                'base_amount' => 10,
            ],
            [
                'name' => 'Transport Charge 1',
                'type' => 'transport_based',
                'amount' => 100,
                'is_driver' => false,
                'amount_type' => 'fixed',
                'min' => 10,
                'max' => 200,
                'package_type' => null,
                'product_type' => null,
                'free_time' => 2,
                'time_unit' => 'hour',
                'base_amount' => null,
            ]
        ];


        AccessorialModel::insert($accessorials);
    }
}
