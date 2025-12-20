<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductSize>
 */
class ProductSizeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $sizeIndex = 0;
        $sizes = [
            '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38',
            '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
            'L', 'M', 'S', 'XL', 'XXL', 'XXXL', 'Custom',
        ];

        return [
            'product_type_id' => \App\Models\ProductType::factory(),
            'size_label' => $sizes[$sizeIndex++ % count($sizes)],
            'is_active' => true,
        ];
    }
}
