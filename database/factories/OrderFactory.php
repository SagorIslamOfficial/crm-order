<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $discountType = fake()->randomElement(['fixed', 'percentage']);
        $discountAmount = $discountType === 'fixed'
            ? fake()->numberBetween(0, 500)
            : fake()->numberBetween(0, 20);

        return [
            'order_number' => 'ORD-'.fake()->unique()->numerify('######'),
            'shop_id' => \App\Models\Shop::factory(),
            'customer_id' => \App\Models\Customer::factory(),
            'delivery_date' => fake()->dateTimeBetween('now', '+30 days'),
            'delivery_address' => fake()->optional()->address(),
            'total_amount' => 0, // Will be calculated by service
            'advance_paid' => 0, // Will be calculated from payments
            'discount_amount' => $discountAmount,
            'discount_type' => $discountType,
            'due_amount' => 0, // Will be calculated by service
            'status' => 'pending',
        ];
    }
}
