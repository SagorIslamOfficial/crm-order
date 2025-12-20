<?php

use App\Models\ProductSize;
use App\Models\ProductType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    $response = $this->actingAs($user)->get('/product-sizes');

    $response->assertStatus(200);
});

test('product sizes can be listed', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    ProductSize::factory()->count(3)->create(['product_type_id' => $productType->id]);

    $response = $this->actingAs($user)->get('/product-sizes');

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-sizes/index')
            ->has('productSizes.data', 3)
            ->has('productSizes.current_page')
            ->has('productSizes.last_page')
            ->has('productTypes')
        );
});

test('product sizes create page is displayed', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    $response = $this->actingAs($user)->get('/product-sizes/create');

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-sizes/create')
            ->has('productTypes')
        );
});

test('product sizes can be created', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();

    $response = $this->actingAs($user)->post('/product-sizes', [
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
        'is_active' => true,
    ]);

    $response->assertRedirect('/product-sizes');

    $this->assertDatabaseHas('product_sizes', [
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
        'is_active' => true,
    ]);
});

test('product sizes creation requires product type', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    $response = $this->actingAs($user)->post('/product-sizes', [
        'size_label' => 'Medium',
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('product_type_id');
});

test('product sizes creation requires size label', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();

    $response = $this->actingAs($user)->post('/product-sizes', [
        'product_type_id' => $productType->id,
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('size_label');
});

test('product sizes creation requires unique size label per product type', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    ProductSize::factory()->create([
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
    ]);

    $response = $this->actingAs($user)->post('/product-sizes', [
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('size_label');
});

test('product sizes can have same size label for different product types', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType1 = ProductType::factory()->create();
    $productType2 = ProductType::factory()->create();
    ProductSize::factory()->create([
        'product_type_id' => $productType1->id,
        'size_label' => 'Medium',
    ]);

    $response = $this->actingAs($user)->post('/product-sizes', [
        'product_type_id' => $productType2->id,
        'size_label' => 'Medium',
        'is_active' => true,
    ]);

    $response->assertRedirect('/product-sizes');

    $this->assertDatabaseHas('product_sizes', [
        'product_type_id' => $productType2->id,
        'size_label' => 'Medium',
    ]);
});

test('product sizes show page is displayed', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    $response = $this->actingAs($user)->get("/product-sizes/{$productSize->id}");

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-sizes/show')
            ->has('productSize')
        );
});

test('product sizes edit page is displayed', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    $response = $this->actingAs($user)->get("/product-sizes/{$productSize->id}/edit");

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-sizes/edit')
            ->has('productSize')
            ->has('productTypes')
        );
});

test('product sizes can be updated', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType1 = ProductType::factory()->create();
    $productType2 = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create([
        'product_type_id' => $productType1->id,
        'size_label' => 'Small',
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->put("/product-sizes/{$productSize->id}", [
        'product_type_id' => $productType2->id,
        'size_label' => 'Large',
        'is_active' => false,
    ]);

    $response->assertRedirect('/product-sizes');

    $productSize->refresh();
    expect($productSize->product_type_id)->toBe($productType2->id);
    expect($productSize->size_label)->toBe('Large');
    expect($productSize->is_active)->toBe(false);
});

test('product sizes update requires unique size label per product type', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    $productSize1 = ProductSize::factory()->create([
        'product_type_id' => $productType->id,
        'size_label' => 'Small',
    ]);
    $productSize2 = ProductSize::factory()->create([
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
    ]);

    $response = $this->actingAs($user)->put("/product-sizes/{$productSize1->id}", [
        'product_type_id' => $productType->id,
        'size_label' => 'Medium',
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('size_label');
});

test('product sizes can be deleted', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);

    $response = $this->actingAs($user)->delete("/product-sizes/{$productSize->id}");

    $response->assertRedirect('/product-sizes');

    $this->assertDatabaseMissing('product_sizes', [
        'id' => $productSize->id,
    ]);
});

test('product sizes with associated orders cannot be deleted', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    $productSize = ProductSize::factory()->create(['product_type_id' => $productType->id]);
    // Create an order item that references this product size
    \App\Models\OrderItem::factory()->create([
        'product_size_id' => $productSize->id,
    ]);

    $response = $this->actingAs($user)->delete("/product-sizes/{$productSize->id}");

    $response->assertRedirect('/product-sizes');
    $response->assertSessionHasErrors('error', 'Cannot delete product size with associated orders.');

    $this->assertDatabaseHas('product_sizes', [
        'id' => $productSize->id,
    ]);
});
