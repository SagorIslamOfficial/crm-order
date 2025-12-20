<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $method = fake()->randomElement(['cash', 'bkash', 'nagad', 'bank']);

        return [
            'order_id' => \App\Models\Order::factory(),
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
}
