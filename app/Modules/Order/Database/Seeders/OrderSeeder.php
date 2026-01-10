<?php

namespace App\Modules\Order\Database\Seeders;

use App\Modules\Customer\Models\Customer;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Models\OrderItem;
use App\Modules\Order\Services\OrderService;
use App\Modules\Payment\Models\Payment;
use App\Modules\Product\Models\ProductSize;
use App\Modules\Product\Models\ProductType;
use App\Modules\Shop\Models\Shop;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orderService = app(OrderService::class);

        // Clear existing demo data
        Payment::truncate();
        OrderItem::truncate();
        Order::whereIn('order_number', ['ORD-001', 'ORD-002', 'ORD-003'])->delete();

        // Get existing data
        $customers = Customer::all();
        $shops = Shop::all();
        $productTypes = ProductType::all();
        $productSizes = ProductSize::all();

        if ($customers->isEmpty() || $shops->isEmpty() || $productTypes->isEmpty() || $productSizes->isEmpty()) {
            return; // Skip if required data doesn't exist
        }

        // Create some demo orders
        $orders = [
            [
                'order_number' => 'ORD-001',
                'shop_id' => $shops->first()->id,
                'customer_id' => $customers->first()->id,
                'delivery_date' => now()->addDays(7),
                'delivery_address' => '123 Main Street, Dhaka',
                'discount_amount' => 0,
                'discount_type' => 'fixed',
                'status' => 'pending',
                'items' => [
                    [
                        'product_type_id' => $productTypes->first()->id,
                        'product_size_id' => $productSizes->first()->id,
                        'quantity' => 2,
                        'price' => 1500,
                        'notes' => 'Custom design requested',
                        'line_total' => 2 * 1500,
                    ],
                    [
                        'product_type_id' => $productTypes->skip(1)->first()?->id ?? $productTypes->first()->id,
                        'product_size_id' => $productSizes->skip(1)->first()?->id ?? $productSizes->first()->id,
                        'quantity' => 1,
                        'price' => 2500,
                        'notes' => null,
                        'line_total' => 1 * 2500,
                    ],
                ],
                'payments' => [
                    [
                        'method' => 'cash',
                        'amount' => 3000,
                        'paid_at' => now()->subDays(2),
                    ],
                ],
            ],
            [
                'order_number' => 'ORD-002',
                'shop_id' => $shops->first()->id,
                'customer_id' => $customers->skip(1)->first()->id,
                'delivery_date' => now()->addDays(14),
                'delivery_address' => '456 Oak Avenue, Chittagong',
                'discount_amount' => 500,
                'discount_type' => 'fixed',
                'status' => 'pending',
                'items' => [
                    [
                        'product_type_id' => $productTypes->skip(2)->first()?->id ?? $productTypes->first()->id,
                        'product_size_id' => $productSizes->skip(2)->first()?->id ?? $productSizes->first()->id,
                        'quantity' => 3,
                        'price' => 1200,
                        'notes' => 'Urgent delivery needed',
                        'line_total' => 3 * 1200,
                    ],
                ],
                'payments' => [
                    [
                        'method' => 'bkash',
                        'amount' => 2000,
                        'transaction_id' => 'BKASH123456789',
                        'account_number' => '01712345678',
                        'paid_at' => now()->subDays(1),
                    ],
                ],
            ],
            [
                'order_number' => 'ORD-003',
                'shop_id' => $shops->first()->id,
                'customer_id' => $customers->skip(2)->first()->id,
                'delivery_date' => now()->addDays(21),
                'delivery_address' => '789 Pine Road, Khulna',
                'discount_amount' => 10,
                'discount_type' => 'percentage',
                'status' => 'pending',
                'items' => [
                    [
                        'product_type_id' => $productTypes->first()->id,
                        'product_size_id' => $productSizes->first()->id,
                        'quantity' => 1,
                        'price' => 3000,
                        'notes' => null,
                        'line_total' => 1 * 3000,
                    ],
                    [
                        'product_type_id' => $productTypes->skip(1)->first()?->id ?? $productTypes->first()->id,
                        'product_size_id' => $productSizes->skip(1)->first()?->id ?? $productSizes->first()->id,
                        'quantity' => 2,
                        'price' => 1800,
                        'notes' => 'Color: Blue',
                        'line_total' => 2 * 1800,
                    ],
                ],
                'payments' => [
                    [
                        'method' => 'nagad',
                        'amount' => 2500,
                        'transaction_id' => 'NAGAD987654321',
                        'account_number' => '01812345678',
                        'paid_at' => now()->subDays(3),
                    ],
                    [
                        'method' => 'cash',
                        'amount' => 2000,
                        'paid_at' => now(),
                    ],
                ],
            ],
        ];

        foreach ($orders as $orderData) {
            $items = $orderData['items'];
            $payments = $orderData['payments'];
            unset($orderData['items'], $orderData['payments']);

            // Skip if order already exists
            if (Order::where('order_number', $orderData['order_number'])->exists()) {
                continue;
            }

            $order = Order::create($orderData);

            // Create order items
            foreach ($items as $itemData) {
                OrderItem::create(array_merge($itemData, ['order_id' => $order->id]));
            }

            // Create payments
            foreach ($payments as $paymentData) {
                Payment::create(array_merge($paymentData, ['order_id' => $order->id]));
            }

            // Recalculate order totals
            $orderService->recalculateTotals($order);
        }

        // Create additional random orders
        Order::factory(15)->create()->each(function ($order) use ($orderService, $productTypes, $productSizes) {
            // Add 1-3 random order items
            $itemCount = rand(1, 3);
            for ($i = 0; $i < $itemCount; $i++) {
                $productType = $productTypes->random();
                $productSize = $productSizes->random();
                $quantity = rand(1, 3);
                $price = rand(500, 5000);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_type_id' => $productType->id,
                    'product_size_id' => $productSize->id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'notes' => rand(0, 1) ? fake()->sentence() : null,
                    'line_total' => $quantity * $price,
                ]);
            }

            // Add 0-2 random payments
            $paymentCount = rand(0, 2);
            for ($i = 0; $i < $paymentCount; $i++) {
                Payment::create([
                    'order_id' => $order->id,
                    'method' => collect(['cash', 'bkash', 'nagad', 'bank'])->random(),
                    'amount' => rand(500, 5000),
                    'transaction_id' => rand(0, 1) ? 'TXN'.rand(100000, 999999) : null,
                    'account_number' => rand(0, 1) ? '01'.rand(10000000, 99999999) : null,
                    'paid_at' => now()->subDays(rand(0, 7)),
                ]);
            }

            // Recalculate totals
            $orderService->recalculateTotals($order);
        });
    }
}
