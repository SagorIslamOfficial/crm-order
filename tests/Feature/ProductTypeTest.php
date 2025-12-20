<?php

use App\Models\ProductType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    $response = $this->actingAs($user)->get('/product-types');

    $response->assertStatus(200);
});

test('product types can be listed', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    ProductType::factory()->count(3)->create();

    $response = $this->actingAs($user)->get('/product-types');

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-types/index')
            ->has('productTypes', 3)
        );
});

test('product types create page is displayed', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    $response = $this->actingAs($user)->get('/product-types/create');

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-types/create')
        );
});

test('product types can be created', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    $response = $this->actingAs($user)->post('/product-types', [
        'name' => 'Test Product Type',
        'is_active' => true,
    ]);

    $response->assertRedirect('/product-types');

    $this->assertDatabaseHas('product_types', [
        'name' => 'Test Product Type',
        'is_active' => true,
    ]);
});

test('product types creation requires name', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    $response = $this->actingAs($user)->post('/product-types', [
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('name');
});

test('product types creation requires unique name', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    ProductType::factory()->create(['name' => 'Existing Type']);

    $response = $this->actingAs($user)->post('/product-types', [
        'name' => 'Existing Type',
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('name');
});

test('product types show page is displayed', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();

    $response = $this->actingAs($user)->get("/product-types/{$productType->id}");

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-types/show')
            ->has('productType')
        );
});

test('product types edit page is displayed', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();

    $response = $this->actingAs($user)->get("/product-types/{$productType->id}/edit");

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('product-types/edit')
            ->has('productType')
        );
});

test('product types can be updated', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create([
        'name' => 'Old Name',
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->put("/product-types/{$productType->id}", [
        'name' => 'Updated Name',
        'is_active' => false,
    ]);

    $response->assertRedirect('/product-types');

    $productType->refresh();
    expect($productType->name)->toBe('Updated Name');
    expect($productType->is_active)->toBe(false);
});

test('product types update requires unique name', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType1 = ProductType::factory()->create(['name' => 'Type 1']);
    $productType2 = ProductType::factory()->create(['name' => 'Type 2']);

    $response = $this->actingAs($user)->put("/product-types/{$productType1->id}", [
        'name' => 'Type 2',
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('name');
});

test('product types can be deleted', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();

    $response = $this->actingAs($user)->delete("/product-types/{$productType->id}");

    $response->assertRedirect('/product-types');

    $this->assertDatabaseMissing('product_types', [
        'id' => $productType->id,
    ]);
});

test('product types with associated orders cannot be deleted', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $productType = ProductType::factory()->create();
    // Create an order item that references this product type
    \App\Models\OrderItem::factory()->create([
        'product_type_id' => $productType->id,
    ]);

    $response = $this->actingAs($user)->delete("/product-types/{$productType->id}");

    $response->assertRedirect('/product-types');
    $response->assertSessionHasErrors('error', 'Cannot delete product type with associated orders.');

    $this->assertDatabaseHas('product_types', [
        'id' => $productType->id,
    ]);
});
