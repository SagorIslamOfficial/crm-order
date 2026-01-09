<?php

namespace App\Modules\Shop\Database\Factories;

use App\Modules\Shop\Models\Shop;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShopFactory extends Factory
{
    protected $model = Shop::class;

    public function definition(): array
    {
        return [
            'code' => fake()->unique()->regexify('[A-Z]{3}'),
            'name' => fake()->company(),
            'address' => fake()->address(),
            'phone' => '01'.fake()->numberBetween(700000000, 999999999),
            'website' => fake()->optional()->domainName(),
            'details' => fake()->optional()->paragraph(),
            'is_active' => true,
            'next_order_sequence' => 1,
        ];
    }
}
