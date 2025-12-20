<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductType>
 */
class ProductTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = [
            'Pant',
            'Shirt',
            'Suit - Designed',
            'Suit Simple',
            'Panjabi',
            'Coaty - Muzib Coat',
            'Coaty - Simple',
            'Sherwani',
            'Pant- Gurkha',
        ];

        return [
            'name' => fake()->unique()->randomElement($types),
            'is_active' => true,
        ];
    }
}
