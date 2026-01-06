<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Customer\Database\Seeders\CustomerSeeder;
use App\Modules\Order\Database\Seeders\OrderSeeder;
use App\Modules\Product\Database\Seeders\ProductSizeSeeder;
use App\Modules\Product\Database\Seeders\ProductTypeSeeder;
use App\Modules\Shop\Database\Seeders\ShopSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // Seed the application's database.
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@sagorislam.dev'],
            [
                'name' => 'Admin User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles(['Administrator']);

        // Create test salesperson
        $sales = User::firstOrCreate(
            ['email' => 'sales@sagorislam.dev'],
            [
                'name' => 'Sales Person',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $sales->syncRoles(['Salesperson']);

        // Create test Product Manager
        $productManager = User::firstOrCreate(
            ['email' => 'pm@sagorislam.dev'],
            [
                'name' => 'Product Manager',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $productManager->syncRoles(['Product Manager']);

        // Create test Quantity Manager
        $quantityManager = User::firstOrCreate(
            ['email' => 'qm@sagorislam.dev'],
            [
                'name' => 'Quantity Manager',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $quantityManager->syncRoles(['Quantity Manager']);

        // Seed master data from modules
        $this->call([
            ShopSeeder::class,
            ProductTypeSeeder::class,
            ProductSizeSeeder::class,
            CustomerSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
