<?php

namespace Database\Factories;

use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CustomerAddress>
 */
class CustomerAddressFactory extends Factory
{
    protected $model = CustomerAddress::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'label' => fake()->randomElement(['Home', 'Office', 'Warehouse']),
            'recipient_name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'street_address' => fake()->streetAddress(),
            'suburb' => fake()->citySuffix(),
            'city' => fake()->city(),
            'province' => 'Gauteng',
            'postal_code' => fake()->postcode(),
            'country' => 'South Africa',
            'is_default' => false,
        ];
    }

    public function default(): static
    {
        return $this->state(fn () => [
            'is_default' => true,
        ]);
    }
}
