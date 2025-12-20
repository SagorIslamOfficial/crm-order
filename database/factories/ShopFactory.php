<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shop>
 */
class ShopFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->lexify('???')),
            'next_order_sequence' => 1,
            'name' => fake()->company().' Fashion',
            'address' => fake()->address(),
            'phone' => fake()->numerify('01#########'),
            'website' => fake()->optional()->domainName(),
            'is_active' => true,
        ];
    }
}
