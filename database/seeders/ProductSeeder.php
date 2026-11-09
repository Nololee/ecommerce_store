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
            // Clothing
            [
                'sku' => 'CLO-001',
                'name' => 'Classic Cotton Crewneck T-Shirt',
                'slug' => 'classic-cotton-t-shirt',
                'category' => 'clothing',
                'description' => 'Crafted from 100% premium combed cotton for everyday breathability, softness, and long-lasting durability.',
                'price' => 199.00,
                'stock_quantity' => 35,
                'image' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'CLO-002',
                'name' => 'Oversized Vintage Denim Jacket',
                'slug' => 'oversized-denim-jacket',
                'category' => 'clothing',
                'description' => 'Classic blue wash denim jacket with a relaxed silhouette, heavy-duty metal buttons, and deep welt pockets.',
                'price' => 699.00,
                'stock_quantity' => 18,
                'image' => 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'CLO-003',
                'name' => 'Relaxed Fit Linen Shirt',
                'slug' => 'relaxed-fit-linen-shirt',
                'category' => 'clothing',
                'description' => 'Lightweight and airy pure linen shirt in natural off-white, ideal for warm days and effortless smart-casual styling.',
                'price' => 399.00,
                'stock_quantity' => 24,
                'image' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'CLO-004',
                'name' => 'Tailored Stretch Chino Trousers',
                'slug' => 'tailored-chino-trousers',
                'category' => 'clothing',
                'description' => 'Versatile stretch-cotton chinos with a modern tapered cut, perfect for both office meetings and casual weekend wear.',
                'price' => 449.00,
                'stock_quantity' => 20,
                'image' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
            ],

            // Electronics
            [
                'sku' => 'ELE-001',
                'name' => 'Wireless Noise-Cancelling Headphones',
                'slug' => 'wireless-noise-cancelling-headphones',
                'category' => 'electronics',
                'description' => 'Immersive studio-grade sound with active noise cancellation, ultra-soft memory foam earcups, and 30-hour battery life.',
                'price' => 899.00,
                'stock_quantity' => 15,
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'ELE-002',
                'name' => 'Minimalist Smartwatch Series 5',
                'slug' => 'minimalist-smartwatch-series-5',
                'category' => 'electronics',
                'description' => 'Sleek AMOLED touchscreen smartwatch with continuous heart rate monitoring, sleep tracking, and 50m water resistance.',
                'price' => 1299.00,
                'stock_quantity' => 12,
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'ELE-003',
                'name' => 'Portable Waterproof Bluetooth Speaker',
                'slug' => 'portable-bluetooth-speaker',
                'category' => 'electronics',
                'description' => 'Compact 360-degree room-filling audio speaker with IPX7 waterproof rating and up to 12 hours of continuous playtime.',
                'price' => 499.00,
                'stock_quantity' => 22,
                'image' => 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'ELE-004',
                'name' => 'Fast Dual Wireless Charging Stand',
                'slug' => 'fast-wireless-charging-stand',
                'category' => 'electronics',
                'description' => '15W Qi-certified fast wireless charging stand with dual-coil design for portrait and landscape smartphone charging.',
                'price' => 299.00,
                'stock_quantity' => 30,
                'image' => 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80',
            ],

            // Beauty
            [
                'sku' => 'BEA-001',
                'name' => 'Daily Hydrating Skincare Set',
                'slug' => 'daily-hydrating-skincare-set',
                'category' => 'beauty',
                'description' => 'A complete 3-step routine featuring pH-balancing cleanser, hyaluronic moisture cream, and soothing botanical essence.',
                'price' => 349.00,
                'stock_quantity' => 25,
                'image' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'BEA-002',
                'name' => 'Vitamin C Brightening Facial Serum',
                'slug' => 'vitamin-c-brightening-serum',
                'category' => 'beauty',
                'description' => 'Potent 15% active Vitamin C facial serum enriched with ferulic acid and Vitamin E for radiant, even-toned skin.',
                'price' => 279.00,
                'stock_quantity' => 28,
                'image' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'BEA-003',
                'name' => 'Organic Nourishing Argan Hair Oil',
                'slug' => 'organic-argan-hair-oil',
                'category' => 'beauty',
                'description' => 'Cold-pressed Moroccan argan oil that restores shine, tames unruly frizz, and shields strands from heat damage.',
                'price' => 220.00,
                'stock_quantity' => 30,
                'image' => 'https://images.unsplash.com/photo-1608248597359-0027f6b95764?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'BEA-004',
                'name' => 'Natural Botanical Clay Detox Mask',
                'slug' => 'natural-botanical-clay-mask',
                'category' => 'beauty',
                'description' => 'French green clay mask infused with organic tea tree and rosemary to gently detoxify pores and revitalize tired skin.',
                'price' => 189.00,
                'stock_quantity' => 20,
                'image' => 'https://images.unsplash.com/photo-1567928815117-640a23351ecf?w=800&auto=format&fit=crop&q=80',
            ],

            // Home & Kitchen
            [
                'sku' => 'HOM-001',
                'name' => 'Handcrafted Ceramic Coffee Mug',
                'slug' => 'handcrafted-ceramic-mug',
                'category' => 'home-kitchen',
                'description' => 'Artisan-made stoneware ceramic mug with a comfortable ergonomic handle and speckled matte glaze finish.',
                'price' => 129.00,
                'stock_quantity' => 40,
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'HOM-002',
                'name' => 'Matte Black Stainless Steel French Press',
                'slug' => 'stainless-steel-french-press',
                'category' => 'home-kitchen',
                'description' => 'Double-walled insulated French press coffee maker in sleek matte black finish that keeps coffee piping hot.',
                'price' => 380.00,
                'stock_quantity' => 16,
                'image' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'HOM-003',
                'name' => 'Scented Soy Wax Aromatherapy Candle',
                'slug' => 'scented-soy-wax-candle',
                'category' => 'home-kitchen',
                'description' => 'Hand-poured amber glass soy wax candle with cedarwood, amber, and vanilla notes. 45-hour clean burn time.',
                'price' => 199.00,
                'stock_quantity' => 35,
                'image' => 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'HOM-004',
                'name' => 'Organic Bamboo Cutting Board Set',
                'slug' => 'bamboo-cutting-board-set',
                'category' => 'home-kitchen',
                'description' => 'Trio of sustainably harvested natural bamboo cutting and serving boards with perimeter juice groove channels.',
                'price' => 249.00,
                'stock_quantity' => 25,
                'image' => 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?w=800&auto=format&fit=crop&q=80',
            ],

            // Accessories
            [
                'sku' => 'ACC-001',
                'name' => 'Everyday Canvas & Leather Backpack',
                'slug' => 'everyday-backpack',
                'category' => 'accessories',
                'description' => 'Water-resistant waxed canvas backpack with genuine leather trim and a padded protective 15-inch laptop sleeve.',
                'price' => 599.00,
                'stock_quantity' => 15,
                'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'ACC-002',
                'name' => 'Classic Polarized Sunglasses',
                'slug' => 'classic-polarized-sunglasses',
                'category' => 'accessories',
                'description' => 'Timeless handcrafted acetate frame sunglasses with UV400 polarized scratch-resistant glare-blocking lenses.',
                'price' => 320.00,
                'stock_quantity' => 22,
                'image' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'ACC-003',
                'name' => 'Full-Grain Leather Bifold Wallet',
                'slug' => 'full-grain-leather-wallet',
                'category' => 'accessories',
                'description' => 'Slim bifold wallet crafted from premium full-grain leather featuring 8 card slots, billfold, and RFID protection.',
                'price' => 280.00,
                'stock_quantity' => 30,
                'image' => 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
            ],
            [
                'sku' => 'ACC-004',
                'name' => 'Insulated Stainless Steel Water Bottle',
                'slug' => 'insulated-stainless-steel-bottle',
                'category' => 'accessories',
                'description' => 'Double-walled vacuum insulated 750ml bottle keeping drinks ice cold for 24 hours or steaming hot for 12 hours.',
                'price' => 219.00,
                'stock_quantity' => 35,
                'image' => 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
            ],
        ];

        foreach ($products as $item) {
            $category = Category::where('slug', $item['category'])->first();

            if (! $category) {
                continue;
            }

            Product::updateOrCreate(
                ['sku' => $item['sku']],
                [
                    'category_id' => $category->id,
                    'name' => $item['name'],
                    'slug' => $item['slug'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'stock_quantity' => $item['stock_quantity'],
                    'image' => $item['image'],
                    'is_active' => true,
                ]
            );
        }
    }
}
