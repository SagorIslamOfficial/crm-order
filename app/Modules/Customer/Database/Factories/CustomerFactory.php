<?php

namespace App\Modules\Customer\Database\Factories;

use App\Modules\Customer\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'phone' => fake()->unique()->numerify('01#########'),
            'name' => fake()->name(),
            'address' => fake()->address(),
        ];
    }
}
