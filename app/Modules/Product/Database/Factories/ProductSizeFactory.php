<?php

namespace App\Modules\Product\Database\Factories;

use App\Modules\Product\Models\ProductSize;
use App\Modules\Product\Models\ProductType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductSize>
 */
class ProductSizeFactory extends Factory
{
    protected $model = ProductSize::class;

    public function definition(): array
    {
        static $sizeIndex = 0;
        $sizes = ['Small', 'Medium', 'Large', 'XL', 'XXL'];

        return [
            'product_type_id' => ProductType::factory(),
            'size_label' => $sizes[$sizeIndex++ % count($sizes)],
            'price' => fake()->randomFloat(2, 10, 500),
            'description' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}
