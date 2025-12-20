<?php

use App\Http\Requests\StoreOrderRequest;
use App\Models\ProductSize;
use App\Models\ProductType;
use App\Models\Shop;
use Illuminate\Support\Facades\Validator;

it('validates shop_id is required', function () {
    $request = new StoreOrderRequest;
    $validator = Validator::make([
        'customer' => ['phone' => '01912345678', 'name' => 'Test'],
        'items' => [['product_type_id' => 'test', 'product_size_id' => 'test', 'quantity' => 1, 'price' => 100]],
    ], $request->rules());

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('shop_id'))->toBeTrue();
});

it('validates shop_id exists', function () {
    $request = new StoreOrderRequest;
    $validator = Validator::make([
        'shop_id' => 'non-existent-uuid',
        'customer' => ['phone' => '01912345678', 'name' => 'Test'],
        'items' => [['product_type_id' => 'test', 'product_size_id' => 'test', 'quantity' => 1, 'price' => 100]],
    ], $request->rules());

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('shop_id'))->toBeTrue();
});

it('validates customer phone is required', function () {
    $shop = Shop::factory()->create();
    $request = new StoreOrderRequest;
    $validator = Validator::make([
        'shop_id' => $shop->id,
        'customer' => ['name' => 'Test'],
        'items' => [['product_type_id' => 'test', 'product_size_id' => 'test', 'quantity' => 1, 'price' => 100]],
    ], $request->rules());

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('customer.phone'))->toBeTrue();
});

it('validates customer phone format', function ($phone) {
    $shop = Shop::factory()->create();
    $request = new StoreOrderRequest;
    $validator = Validator::make([
        'shop_id' => $shop->id,
        'customer' => ['phone' => $phone, 'name' => 'Test'],
        'items' => [['product_type_id' => 'test', 'product_size_id' => 'test', 'quantity' => 1, 'price' => 100]],
    ], $request->rules());

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('customer.phone'))->toBeTrue();
})->with([
    '0191234567',     // Too short
    '019123456789',   // Too long
    '02912345678',    // Invalid prefix
    'abcd1234567',    // Contains letters
]);

it('validates customer name is required', function () {
    $shop = Shop::factory()->create();
    $request = new StoreOrderRequest;
    $validator = Validator::make([
        'shop_id' => $shop->id,
        'customer' => ['phone' => '01912345678'],
        'items' => [['product_type_id' => 'test', 'product_size_id' => 'test', 'quantity' => 1, 'price' => 100]],
    ], $request->rules());

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('customer.name'))->toBeTrue();
});

it('validates items array is required', function () {
    $shop = Shop::factory()->create();
    $request = new StoreOrderRequest;
    $validator = Validator::make([
        'shop_id' => $shop->id,
        'customer' => ['phone' => '01912345678', 'name' => 'Test'],
    ], $request->rules());

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('items'))->toBeTrue();
});

it('validates items array has at least one item', function () {
    $shop = Shop::factory()->create();
    $request = new StoreOrderRequest;
    $validator = Validator::make([
        'shop_id' => $shop->id,
        'customer' => ['phone' => '01912345678', 'name' => 'Test'],
        'items' => [],
    ], $request->rules());

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('items'))->toBeTrue();
});

it('validates item quantity is minimum 1', function () {
    $shop = Shop::factory()->create();
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);
    $request = new StoreOrderRequest;
    $validator = Validator::make([
        'shop_id' => $shop->id,
        'customer' => ['phone' => '01912345678', 'name' => 'Test'],
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 0,
                'price' => 100,
            ],
        ],
    ], $request->rules());

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('items.0.quantity'))->toBeTrue();
});

it('validates item price is non-negative', function () {
    $shop = Shop::factory()->create();
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);
    $request = new StoreOrderRequest;
    $validator = Validator::make([
        'shop_id' => $shop->id,
        'customer' => ['phone' => '01912345678', 'name' => 'Test'],
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 1,
                'price' => -100,
            ],
        ],
    ], $request->rules());

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('items.0.price'))->toBeTrue();
});

it('validates delivery date is in future', function () {
    $shop = Shop::factory()->create();
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);
    $request = new StoreOrderRequest;
    $validator = Validator::make([
        'shop_id' => $shop->id,
        'customer' => ['phone' => '01912345678', 'name' => 'Test'],
        'delivery_date' => now()->subDay()->toDateString(),
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 1,
                'price' => 100,
            ],
        ],
    ], $request->rules());

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('delivery_date'))->toBeTrue();
});

it('allows order creation without payment information', function () {
    $shop = Shop::factory()->create();
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);
    $request = new StoreOrderRequest;
    $request->merge([
        'shop_id' => $shop->id,
        'customer' => ['phone' => '01912345678', 'name' => 'Test'],
        'delivery_date' => now()->addDay()->toDateString(),
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 1,
                'price' => 100,
            ],
        ],
        'payment' => ['method' => '', 'amount' => null],
    ]);

    // Simulate prepareForValidation
    $request->prepareForValidation();

    $validator = Validator::make($request->all(), $request->rules());

    expect($validator->fails())->toBeFalse();
});

it('requires payment amount when payment method is selected', function () {
    $shop = Shop::factory()->create();
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);
    $request = new StoreOrderRequest;
    $validator = Validator::make([
        'shop_id' => $shop->id,
        'customer' => ['phone' => '01912345678', 'name' => 'Test'],
        'delivery_date' => now()->addDay()->toDateString(),
        'items' => [
            [
                'product_type_id' => $productType->id,
                'product_size_id' => $productSize->id,
                'quantity' => 1,
                'price' => 100,
            ],
        ],
        'payment' => ['method' => 'cash', 'amount' => null],
    ], $request->rules());

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->has('payment.amount'))->toBeTrue();
});
