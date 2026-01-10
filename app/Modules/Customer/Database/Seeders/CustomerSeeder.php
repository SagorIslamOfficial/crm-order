<?php

namespace App\Modules\Customer\Database\Seeders;

use App\Modules\Customer\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some demo customers
        Customer::firstOrCreate(
            ['phone' => '01712345678'],
            [
                'name' => 'John Doe',
                'address' => '123 Main Street, Dhaka',
            ]
        );

        Customer::firstOrCreate(
            ['phone' => '01812345678'],
            [
                'name' => 'Jane Smith',
                'address' => '456 Oak Avenue, Chittagong',
            ]
        );

        Customer::firstOrCreate(
            ['phone' => '01912345678'],
            [
                'name' => 'Bob Johnson',
                'address' => '789 Pine Road, Khulna',
            ]
        );

        Customer::firstOrCreate(
            ['phone' => '01612345678'],
            [
                'name' => 'Alice Brown',
                'address' => '321 Elm Street, Rajshahi',
            ]
        );

        Customer::firstOrCreate(
            ['phone' => '01512345678'],
            [
                'name' => 'Charlie Wilson',
                'address' => '654 Maple Drive, Sylhet',
            ]
        );

        // Create additional random customers
        Customer::factory(10)->create();
    }
}
