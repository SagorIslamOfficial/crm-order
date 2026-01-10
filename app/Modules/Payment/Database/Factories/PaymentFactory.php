<?php

namespace App\Modules\Payment\Database\Factories;

use App\Modules\Order\Models\Order;
use App\Modules\Payment\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $method = fake()->randomElement(['cash', 'bkash', 'nagad', 'bank']);

        return [
            'order_id' => Order::factory(),
            'method' => $method,
            'amount' => fake()->numberBetween(100, 10000),
            'transaction_id' => in_array($method, ['bkash', 'nagad', 'bank'])
                ? fake()->bothify('TXN##########')
                : null,
            'account_number' => in_array($method, ['bkash', 'nagad'])
                ? fake()->numerify('01#########')
                : ($method === 'bank' ? fake()->numerify('################') : null),
            'paid_at' => fake()->dateTimeBetween('-7 days', 'now'),
        ];
    }

    /**
     * Indicate that the payment is via cash.
     */
    public function cash(): static
    {
        return $this->state(fn (array $attributes) => [
            'method' => 'cash',
            'transaction_id' => null,
            'account_number' => null,
        ]);
    }

    /**
     * Indicate that the payment is via bKash.
     */
    public function bkash(): static
    {
        return $this->state(fn (array $attributes) => [
            'method' => 'bkash',
            'mfs_provider' => 'bkash',
            'mfs_number' => fake()->numerify('01#########'),
            'transaction_id' => fake()->bothify('TXN##########'),
        ]);
    }
}
