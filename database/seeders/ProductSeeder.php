<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'sku' => 'CLO-001',
                'name' => 'Classic T-Shirt',
                'slug' => 'classic-t-shirt',
                'category' => 'clothing',
                'description' => 'A comfortable everyday classic T-shirt.',
                'price' => 199.00,
                'stock_quantity' => 30,
            ],
            [
                'sku' => 'ELE-001',
                'name' => 'Wireless Headphones',
                'slug' => 'wireless-headphones',
                'category' => 'electronics',
                'description' => 'Wireless headphones for everyday listening.',
                'price' => 599.00,
                'stock_quantity' => 15,
            ],
            [
                'sku' => 'BEA-001',
                'name' => 'Daily Skincare Set',
                'slug' => 'daily-skincare-set',
                'category' => 'beauty',
                'description' => 'A simple skincare set for daily use.',
                'price' => 349.00,
                'stock_quantity' => 20,
            ],
            [
                'sku' => 'HOM-001',
                'name' => 'Ceramic Coffee Mug',
                'slug' => 'ceramic-coffee-mug',
                'category' => 'home-kitchen',
                'description' => 'A stylish ceramic mug for your favourite drinks.',
                'price' => 129.00,
                'stock_quantity' => 40,
            ],
            [
                'sku' => 'ACC-001',
                'name' => 'Everyday Backpack',
                'slug' => 'everyday-backpack',
                'category' => 'accessories',
                'description' => 'A practical backpack for work, school and travel.',
                'price' => 449.00,
                'stock_quantity' => 12,
            ],
        ];

        foreach ($products as $item) {
            $category = Category::where('slug', $item['category'])
                ->firstOrFail();

            Product::updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'category_id' => $category->id,
                    'name' => $item['name'],
                    'slug' => $item['slug'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'stock_quantity' => $item['stock_quantity'],
                    'is_active' => true,
                ]
            );
        }
    }
}

