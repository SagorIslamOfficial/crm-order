<?php

namespace Database\Seeders;

use App\Models\Shop;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shops = [
            [
                'code' => 'DHK',
                'name' => 'Platinumys Fashion - Uttara',
                'address' => 'House 14, Road 4, Sector 12, Uttara, Dhaka, BD',
                'phone' => '01711333828',
                'website' => 'platinumys.com',
                'is_active' => true,
                'next_order_sequence' => 1,
            ],
            [
                'code' => 'MIR',
                'name' => 'Platinumys Fashion - Mirpur',
                'address' => '1st Floor, House: 139, Block: F, Road: 5, Journalist R/A, Pallabi, Mirpur, Dhaka-1216, Bangladesh',
                'phone' => '01711333829',
                'website' => 'platinumys.com',
                'is_active' => true,
                'next_order_sequence' => 1,
            ],
            [
                'code' => 'CTG',
                'name' => 'Platinumys Fashion - Chattogram',
                'address' => 'Shop No- 12, 1st Floor, New Market, Chattogram, BD',
                'phone' => '01711333830',
                'website' => 'platinumys.com',
                'is_active' => true,
                'next_order_sequence' => 1,
            ],
            [
                'code' => 'KHL',
                'name' => 'Platinumys Fashion - Khulna',
                'address' => 'House 23, Road 5, New Market, Khulna, BD',
                'phone' => '01711333831',
                'website' => 'platinumys.com',
                'is_active' => true,
                'next_order_sequence' => 1,
            ],
        ];

        foreach ($shops as $shop) {
            Shop::firstOrCreate(
                ['code' => $shop['code']],
                $shop
            );
        }
    }
}
