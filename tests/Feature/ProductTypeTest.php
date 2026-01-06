<?php

use App\Models\User;
use App\Modules\Order\Models\OrderItem;
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
    Permission::create(['name' => 'product-types.view']);
    Permission::create(['name' => 'product-types.create']);
    Permission::create(['name' => 'product-types.update']);
    Permission::create(['name' => 'product-types.delete']);

    // Create Administrator role with all permissions
    $adminRole = Role::create(['name' => 'Administrator']);
    $adminRole->givePermissionTo(Permission::all());
});

test('product types index page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    get('/product-types')->assertStatus(200);
});

test('product types can be listed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    ProductType::factory()->count(3)->create();

    actingAs($user);

    get('/product-types')->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-types/index')
            ->has('productTypes', 3)
        );
});

test('product types create page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    get('/product-types/create')->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-types/create')
        );
});

test('product types can be created', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    post('/product-types', [
        'name' => 'Test Product Type',
        'is_active' => true,
    ])->assertRedirect('/product-types');

    assertDatabaseHas('product_types', [
        'name' => 'Test Product Type',
        'is_active' => true,
    ]);
});

test('product types creation requires name', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    post('/product-types', [
        'is_active' => true,
    ])->assertSessionHasErrors('name');
});

test('product types creation requires unique name', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    ProductType::factory()->create(['name' => 'Existing Type']);

    actingAs($user);

    post('/product-types', [
        'name' => 'Existing Type',
        'is_active' => true,
    ])->assertSessionHasErrors('name');
});

test('product types show page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();

    actingAs($user);

    get("/product-types/{$productType->id}")->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-types/show')
            ->has('productType')
        );
});

test('product types edit page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();

    actingAs($user);

    get("/product-types/{$productType->id}/edit")->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-types/edit')
            ->has('productType')
        );
});

test('product types can be updated', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create([
        'name' => 'Old Name',
        'is_active' => true,
    ]);

    actingAs($user);

    put("/product-types/{$productType->id}", [
        'name' => 'Updated Name',
        'is_active' => false,
    ])->assertRedirect('/product-types');

    $productType->refresh();
    expect($productType->name)->toBe('Updated Name');
    expect($productType->is_active)->toBe(false);
});

test('product types update requires unique name', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType1 = ProductType::factory()->create(['name' => 'Type 1']);
    $productType2 = ProductType::factory()->create(['name' => 'Type 2']);

    actingAs($user);

    put("/product-types/{$productType1->id}", [
        'name' => 'Type 2',
        'is_active' => true,
    ])->assertSessionHasErrors('name');
});

test('product types can be deleted', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();

    actingAs($user);

    delete("/product-types/{$productType->id}")->assertRedirect('/product-types');

    assertDatabaseMissing('product_types', [
        'id' => $productType->id,
    ]);
});

test('product types with associated orders cannot be deleted', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    // Create an order item that references this product type
    OrderItem::factory()->create([
        'product_type_id' => $productType->id,
    ]);

    actingAs($user);

    delete("/product-types/{$productType->id}")->assertRedirect('/product-types')
        ->assertSessionHasErrors('error', 'Cannot delete product type with associated orders.');

    assertDatabaseHas('product_types', [
        'id' => $productType->id,
    ]);
});
