<?php

use App\Models\User;
use App\Modules\Order\Models\OrderItem;
use App\Modules\Product\Models\ProductSize;
use App\Modules\Product\Models\ProductType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create permissions for testing
    Permission::create(['name' => 'product-sizes.view']);
    Permission::create(['name' => 'product-sizes.create']);
    Permission::create(['name' => 'product-sizes.update']);
    Permission::create(['name' => 'product-sizes.delete']);

    // Create Administrator role with all permissions
    $adminRole = Role::create(['name' => 'Administrator']);
    $adminRole->givePermissionTo(Permission::all());
});

test('product sizes index page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    get('/product-sizes')->assertStatus(200);
});

test('product sizes can be listed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    ProductSize::factory()->count(3)->create(['product_type_id' => $productType->id]);

    actingAs($user);

    get('/product-sizes')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-sizes/index')
            ->has('productSizes.data', 3)
            ->has('productSizes.current_page')
            ->has('productSizes.last_page')
            ->has('productTypes')
        );
});

test('product sizes create page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    get('/product-sizes/create')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-sizes/create')
            ->has('productTypes')
        );
});

test('product sizes can be created', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();

    actingAs($user);

    post('/product-sizes', [
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
        'price' => 100.00,
        'is_active' => true,
    ])->assertRedirect('/product-sizes');

    assertDatabaseHas('product_sizes', [
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
        'price' => 100.00,
        'is_active' => true,
    ]);
});

test('product sizes creation requires product type', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    post('/product-sizes', [
        'size_label' => 'Medium',
        'is_active' => true,
    ])->assertSessionHasErrors('product_type_id');
});

test('product sizes creation requires size label', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();

    actingAs($user);

    post('/product-sizes', [
        'product_type_id' => $productType->id,
        'is_active' => true,
    ])->assertSessionHasErrors('size_label');
});

test('product sizes creation requires unique size label per product type', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    ProductSize::factory()->create([
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
        'price' => 50.00,
    ]);

    actingAs($user);

    post('/product-sizes', [
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
        'price' => 100.00,
        'is_active' => true,
    ])->assertSessionHasErrors('size_label');
});

test('product sizes can have same size label for different product types', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType1 = ProductType::factory()->create();
    $productType2 = ProductType::factory()->create();
    ProductSize::factory()->create([
        'product_type_id' => $productType1->id,
        'size_label' => 'Medium',
    ]);

    actingAs($user);

    post('/product-sizes', [
        'product_type_id' => $productType2->id,
        'size_label' => 'Medium',
        'price' => 100.00,
        'is_active' => true,
    ])->assertRedirect('/product-sizes');

    assertDatabaseHas('product_sizes', [
        'product_type_id' => $productType2->id,
        'size_label' => 'Medium',
        'price' => 100.00,
    ]);
});

test('product sizes show page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    actingAs($user);

    get("/product-sizes/{$productSize->id}")
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-sizes/show')
            ->has('productSize')
        );
});

test('product sizes edit page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    actingAs($user);

    get("/product-sizes/{$productSize->id}/edit")
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-sizes/edit')
            ->has('productSize')
            ->has('productTypes')
        );
});

test('product sizes can be updated', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType1 = ProductType::factory()->create();
    $productType2 = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create([
        'product_type_id' => $productType1->id,
        'size_label' => 'Small',
        'is_active' => true,
    ]);

    actingAs($user);

    put("/product-sizes/{$productSize->id}", [
        'product_type_id' => $productType2->id,
        'size_label' => 'Large',
        'price' => 200.00,
        'is_active' => false,
    ])->assertRedirect('/product-sizes');

    $productSize->refresh();
    expect($productSize->product_type_id)->toBe($productType2->id);
    expect($productSize->size_label)->toBe('Large');
    expect($productSize->is_active)->toBe(0);
});

test('product sizes update requires unique size label per product type', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    $productSize1 = ProductSize::factory()->create([
        'product_type_id' => $productType->id,
        'size_label' => 'Small',
        'price' => 25.00,
    ]);
    $productSize2 = ProductSize::factory()->create([
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
        'price' => 50.00,
    ]);

    actingAs($user);

    put("/product-sizes/{$productSize1->id}", [
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
        'price' => 75.00,
        'is_active' => true,
    ])->assertSessionHasErrors('size_label');
});

test('product sizes can be deleted', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    actingAs($user);

    delete("/product-sizes/{$productSize->id}")
        ->assertRedirect('/product-sizes');

    assertDatabaseMissing('product_sizes', [
        'id' => $productSize->id,
    ]);
});

test('product sizes with associated orders cannot be deleted', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);
    // Create an order item that references this product size
    OrderItem::factory()->create([
        'product_size_id' => $productSize->id,
    ]);

    actingAs($user);

    delete("/product-sizes/{$productSize->id}")
        ->assertRedirect('/product-sizes')
        ->assertSessionHasErrors('error', 'Cannot delete product size with associated orders.');

    assertDatabaseHas('product_sizes', [
        'id' => $productSize->id,
    ]);
});
