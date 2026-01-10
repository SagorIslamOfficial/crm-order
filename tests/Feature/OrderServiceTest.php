<?php

use App\Modules\Customer\Models\Customer;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Services\OrderService;
use App\Modules\Product\Models\ProductSize;
use App\Modules\Product\Models\ProductType;
use App\Modules\Shop\Models\Shop;

it('generates sequential order numbers with shop code', function () {
    $orderService = app(OrderService::class);
    $shop = Shop::factory()->create(['code' => 'DHK', 'next_order_sequence' => 1]);
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    $orderData = [
        'shop_id' => $shop->id,
        'customer' => [
            'phone' => '01912345678',
            'name' => 'Test Customer',
        ],
        'delivery_date' => now()->addDays(7)->toDateString(),
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 1,
                'price' => 1500,
            ],
        ],
    ];

    $order1 = $orderService->create($orderData);
    $order2 = $orderService->create($orderData);

    expect($order1->order_number)->toBe('ORD-DHK-000001');
    expect($order2->order_number)->toBe('ORD-DHK-000002');
});

it('finds or creates customer by phone', function () {
    $orderService = app(OrderService::class);
    $shop = Shop::factory()->create();
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    $orderData = [
        'shop_id' => $shop->id,
        'customer' => [
            'phone' => '01712345678',
            'name' => 'John Doe',
            'address' => '123 Test St',
        ],
        'delivery_date' => now()->addDays(7)->toDateString(),
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 1,
                'price' => 2000,
            ],
        ],
    ];

    // First order creates customer
    $order1 = $orderService->create($orderData);

    // Second order with same phone reuses customer
    $orderData['customer']['name'] = 'Jane Doe'; // Different name
    $order2 = $orderService->create($orderData);

    expect($order1->customer_id)->toBe($order2->customer_id);
    expect(Customer::where('phone', '01712345678')->count())->toBe(1);
});

it('calculates fixed discount correctly', function () {
    $orderService = app(OrderService::class);
    $shop = Shop::factory()->create();
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    $orderData = [
        'shop_id' => $shop->id,
        'customer' => [
            'phone' => '01812345678',
            'name' => 'Test Customer',
        ],
        'delivery_date' => now()->addDays(7)->toDateString(),
        'discount_amount' => 200,
        'discount_type' => 'fixed',
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 2,
                'price' => 1000,
            ],
        ],
    ];

    $order = $orderService->create($orderData);

    expect($order->total_amount)->toBe('1800.00'); // 2000 - 200
    expect($order->discount_amount)->toBe('200.00');
});

it('calculates percentage discount correctly', function () {
    $orderService = app(OrderService::class);
    $shop = Shop::factory()->create();
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    $orderData = [
        'shop_id' => $shop->id,
        'customer' => [
            'phone' => '01612345678',
            'name' => 'Test Customer',
        ],
        'delivery_date' => now()->addDays(7)->toDateString(),
        'discount_amount' => 10, // 10%
        'discount_type' => 'percentage',
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 1,
                'price' => 2000,
            ],
        ],
    ];

    $order = $orderService->create($orderData);

    expect($order->total_amount)->toBe('1800.00'); // 2000 - (2000 * 0.10)
    expect($order->discount_amount)->toBe('200.00');
});

it('creates order with initial payment', function () {
    $orderService = app(OrderService::class);
    $shop = Shop::factory()->create();
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    $orderData = [
        'shop_id' => $shop->id,
        'customer' => [
            'phone' => '01512345678',
            'name' => 'Test Customer',
        ],
        'delivery_date' => now()->addDays(7)->toDateString(),
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 1,
                'price' => 3000,
            ],
        ],
        'payment' => [
            'method' => 'cash',
            'amount' => 1000,
        ],
    ];

    $order = $orderService->create($orderData);

    expect($order->total_amount)->toBe('3000.00');
    expect($order->advance_paid)->toBe('1000.00');
    expect($order->due_amount)->toBe('2000.00');
    expect($order->payments)->toHaveCount(1);
});

it('adds additional payment and updates totals', function () {
    $orderService = app(OrderService::class);
    $shop = Shop::factory()->create();
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    $orderData = [
        'shop_id' => $shop->id,
        'customer' => [
            'phone' => '01412345678',
            'name' => 'Test Customer',
        ],
        'delivery_date' => now()->addDays(7)->toDateString(),
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 1,
                'price' => 5000,
            ],
        ],
        'payment' => [
            'method' => 'cash',
            'amount' => 2000,
        ],
    ];

    $order = $orderService->create($orderData);

    expect($order->advance_paid)->toBe('2000.00');
    expect($order->due_amount)->toBe('3000.00');

    // Add second payment
    $order = $orderService->addPayment($order, [
        'method' => 'bkash',
        'amount' => 1500,
        'transaction_id' => 'TXN123456',
    ]);

    expect($order->advance_paid)->toBe('3500.00');
    expect($order->due_amount)->toBe('1500.00');
    expect($order->payments)->toHaveCount(2);
});

it('creates multiple order items with correct line totals', function () {
    $orderService = app(OrderService::class);
    $shop = Shop::factory()->create();
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    $orderData = [
        'shop_id' => $shop->id,
        'customer' => [
            'phone' => '01312345678',
            'name' => 'Test Customer',
        ],
        'delivery_date' => now()->addDays(7)->toDateString(),
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 2,
                'price' => 1500,
                'notes' => 'Custom measurements',
            ],
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 1,
                'price' => 2500,
            ],
        ],
    ];

    $order = $orderService->create($orderData);

    expect($order->items)->toHaveCount(2);
    expect($order->items[0]->line_total)->toBe('3000.00'); // 2 * 1500
    expect($order->items[1]->line_total)->toBe('2500.00'); // 1 * 2500
    expect($order->total_amount)->toBe('5500.00');
});
