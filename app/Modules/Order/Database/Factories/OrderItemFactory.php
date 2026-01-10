<?php

namespace App\Modules\Order\Database\Factories;

use App\Modules\Order\Models\Order;
use App\Modules\Order\Models\OrderItem;
use App\Modules\Product\Models\ProductSize;
use App\Modules\Product\Models\ProductType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

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
            'order_id' => Order::factory(),
            'product_type_id' => ProductType::factory(),
            'product_size_id' => ProductSize::factory(),
            'quantity' => $quantity,
            'price' => $price,
            'notes' => fake()->optional()->sentence(),
            'line_total' => $quantity * $price,
        ];
    }
}
