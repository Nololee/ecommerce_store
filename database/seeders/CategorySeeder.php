<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Clothing', 'slug' => 'clothing'],
            ['name' => 'Electronics', 'slug' => 'electronics'],
            ['name' => 'Beauty', 'slug' => 'beauty'],
            ['name' => 'Home & Kitchen', 'slug' => 'home-kitchen'],
            ['name' => 'Accessories', 'slug' => 'accessories'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'is_active' => true,
                ]
            );
        }
    }
}

