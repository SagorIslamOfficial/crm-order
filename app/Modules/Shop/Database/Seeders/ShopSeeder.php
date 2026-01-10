<?php

namespace App\Modules\Shop\Database\Seeders;

use App\Modules\Shop\Models\Shop;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    // Run the database seeds.
    public function run(): void
    {
        $shops = [
            [
                'code' => 'PLT001',
                'name' => 'Platinumys Fashion - Uttara',
                'address' => 'House 14, Road 4, Sector 12, Uttara, Dhaka, BD',
                'phone' => '01712345678',
                'website' => 'https://www.platinumys.com',
                'details' => 'Main shop located in Uttara',
            ],
            [
                'code' => 'PLT002',
                'name' => 'Platinumys Fashion - Mirpur',
                'address' => '1st Floor, House: 139, Block: F, Road: 5, Journalist R/A, Pallabi, Mirpur, Dhaka-1216, Bangladesh',
                'phone' => '01787654321',
                'website' => 'https://www.platinumys.com/mirpur',
                'details' => 'Branch shop located in Mirpur',
            ],
            [
                'code' => 'PLT003',
                'name' => 'Platinumys Fashion - Chattogram',
                'address' => 'Shop No- 12, 1st Floor, New Market, Chattogram, BD',
                'phone' => '01711223344',
                'website' => 'https://www.platinumys.com/chattogram',
                'details' => 'Branch shop located in Chattogram',
            ],
            [
                'code' => 'PLT004',
                'name' => 'Platinumys Fashion - Khulna',
                'address' => 'House 23, Road 5, New Market, Khulna, BD',
                'phone' => '01744332211',
                'website' => 'https://www.platinumys.com/khulna',
                'details' => 'Branch shop located in Khulna',
            ],
        ];

        foreach ($shops as $shop) {
            Shop::firstOrCreate(
                ['code' => $shop['code']],
                [
                    'name' => $shop['name'],
                    'address' => $shop['address'],
                    'phone' => $shop['phone'],
                    'website' => $shop['website'],
                    'details' => $shop['details'],
                ]
            );
        }
    }
}
