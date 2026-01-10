<?php

namespace App\Modules\Product\Database\Seeders;

use App\Modules\Product\Models\ProductType;
use Illuminate\Database\Seeder;

class ProductTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productTypes = [
            'Coaty - Muzib Coat',
            'Coaty - Simple',
            'Panjabi',
            'Pant',
            'Pant- Gurkha',
            'Sherwani',
            'Shirt',
            'Suit - Designed',
            'Suit Simple',
        ];

        foreach ($productTypes as $type) {
            ProductType::firstOrCreate(
                ['name' => $type],
                ['description' => null]
            );
        }
    }
}
