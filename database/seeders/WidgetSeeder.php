<?php

namespace Database\Seeders;

use App\Models\Widget;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WidgetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $widgets = ['Customer stats', 'Latest Fuel Surcharges'];

        $widgets_data = collect($widgets)->map(function($widget){
            return ['name' => $widget];
        });

        Widget::truncate();
        Widget::insert($widgets_data->toArray());
    }
}
