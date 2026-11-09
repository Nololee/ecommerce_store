<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'sku' => strtoupper(fake()->bothify('PRO-####')),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 50, 1000),
            'stock_quantity' => fake()->numberBetween(5, 50),
            'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
            'is_active' => true,
        ];
    }

    public function outOfStock(): static
    {
        return $this->state(fn () => [
            'stock_quantity' => 0,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
        ]);
    }
}
