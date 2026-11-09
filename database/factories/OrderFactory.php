<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'tracking_number' => 'ARN-'.date('Y').'-'.strtoupper(Str::random(6)),
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'customer_phone' => fake()->phoneNumber(),
            'shipping_address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'postal_code' => fake()->postcode(),
            'subtotal' => 500.00,
            'shipping_fee' => 75.00,
            'total_amount' => 575.00,
            'payment_method' => 'card_sandbox',
            'payment_status' => 'paid',
            'payment_transaction_id' => 'TXN_SANDBOX_'.strtoupper(Str::random(12)),
            'status' => 'processing',
        ];
    }
}
