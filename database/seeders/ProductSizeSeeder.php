<?php

namespace Database\Seeders;

use App\Models\ProductSize;
use App\Models\ProductType;
use Illuminate\Database\Seeder;

class ProductSizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productTypes = ProductType::all();

        // Common sizes for all product types
        $numericSizes = [
            '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38',
            '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
        ];

        $letterSizes = [
            'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom',
        ];

        foreach ($productTypes as $productType) {

            // Add numeric sizes
            foreach ($numericSizes as $size) {
                ProductSize::firstOrCreate(
                    [
                        'product_type_id' => $productType->id,
                        'size_label' => $size,
                    ],
                    [
                        'is_active' => true,
                    ]
                );
            }

            // Add letter sizes
            foreach ($letterSizes as $size) {
                ProductSize::firstOrCreate(
                    [
                        'product_type_id' => $productType->id,
                        'size_label' => $size,
                    ],
                    [
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
