<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 3);
        $price = fake()->numberBetween(500, 5000);

        return [
            'order_id' => \App\Models\Order::factory(),
            'product_type_id' => \App\Models\ProductType::factory(),
            'product_size_id' => \App\Models\ProductSize::factory(),
            'quantity' => $quantity,
            'price' => $price,
            'notes' => fake()->optional()->sentence(),
            'line_total' => $quantity * $price,
        ];
    }
}
