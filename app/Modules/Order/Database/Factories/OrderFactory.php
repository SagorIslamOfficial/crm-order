<?php

namespace App\Modules\Order\Database\Factories;

use App\Modules\Customer\Models\Customer;
use App\Modules\Order\Models\Order;
use App\Modules\Shop\Models\Shop;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

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
            'shop_id' => Shop::factory(),
            'customer_id' => Customer::factory(),
            'delivery_date' => fake()->dateTimeBetween('now', '+30 days'),
            'delivery_address' => fake()->optional()->address(),
            'total_amount' => 0,
            'advance_paid' => 0,
            'discount_amount' => $discountAmount,
            'discount_type' => $discountType,
            'due_amount' => 0,
            'status' => 'pending',
        ];
    }

    /**
     * Indicate that the order is delivered.
     */
    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'delivered',
        ]);
    }

    /**
     * Indicate that the order is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }
}
