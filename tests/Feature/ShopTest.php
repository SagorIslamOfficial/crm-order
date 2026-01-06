<?php

use App\Models\User;
use App\Modules\Order\Models\Order;
use App\Modules\Shop\Models\Shop;
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
    Permission::create(['name' => 'shops.view']);
    Permission::create(['name' => 'shops.create']);
    Permission::create(['name' => 'shops.update']);
    Permission::create(['name' => 'shops.delete']);

    // Create Administrator role with all permissions
    $adminRole = Role::create(['name' => 'Administrator']);
    $adminRole->givePermissionTo(Permission::all());
});

test('shops index page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    get('/shops')->assertStatus(200);
});

test('shops can be listed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    Shop::factory()->count(3)->create();

    actingAs($user);

    get('/shops')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('shops/index')
            ->has('shops.data', 3)
            ->has('shops.current_page')
            ->has('shops.last_page')
        );
});

test('shops create page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    get('/shops/create')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('shops/create')
        );
});

test('shops can be created', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    post('/shops', [
        'code' => 'TST',
        'name' => 'Test Shop',
        'address' => '123 Test Street, Test City',
        'phone' => '01711234567',
        'website' => 'testshop.com',
        'is_active' => true,
    ])->assertRedirect('/shops');

    assertDatabaseHas('shops', [
        'code' => 'TST',
        'name' => 'Test Shop',
        'address' => '123 Test Street, Test City',
        'phone' => '01711234567',
        'website' => 'testshop.com',
        'is_active' => true,
        'next_order_sequence' => 1,
    ]);
});

test('shops creation requires code', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    post('/shops', [
        'location' => '123 Test Street',
        'details' => 'Test shop details',
    ])->assertSessionHasErrors('name');
});

test('shops creation requires unique code', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    Shop::factory()->create(['code' => 'TST']);

    actingAs($user);

    post('/shops', [
        'code' => 'TST',
        'name' => 'Test Shop',
        'address' => '123 Test Street',
        'phone' => '01711234567',
        'is_active' => true,
    ])->assertSessionHasErrors('code');
});

test('shops creation requires name', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    post('/shops', [
        'code' => 'TST',
        'address' => '123 Test Street',
        'phone' => '01711234567',
        'is_active' => true,
    ])->assertSessionHasErrors('name');
});

test('shops creation requires address', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    post('/shops', [
        'code' => 'TST',
        'name' => 'Test Shop',
        'phone' => '01711234567',
        'is_active' => true,
    ])->assertSessionHasErrors('address');
});

test('shops creation requires valid phone number', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    post('/shops', [
        'code' => 'TST',
        'name' => 'Test Shop',
        'address' => '123 Test Street',
        'phone' => 'invalid',
        'is_active' => true,
    ])->assertSessionHasErrors('phone');
});

test('shops creation requires 11 digit phone number', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    post('/shops', [
        'code' => 'TST',
        'name' => 'Test Shop',
        'address' => '123 Test Street',
        'phone' => '0171123456', // Only 10 digits
        'is_active' => true,
    ])->assertSessionHasErrors('phone');
});

test('shops show page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $shop = Shop::factory()->create();

    actingAs($user);

    get("/shops/{$shop->id}")
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('shops/show')
            ->has('shop')
        );
});

test('shops edit page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $shop = Shop::factory()->create();

    actingAs($user);

    get("/shops/{$shop->id}/edit")
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('shops/edit')
            ->has('shop')
        );
});

test('shops can be updated', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $shop = Shop::factory()->create([
        'code' => 'OLD',
        'name' => 'Old Shop',
        'address' => 'Old Address',
        'phone' => '01711111111',
        'is_active' => true,
    ]);

    actingAs($user);

    put("/shops/{$shop->id}", [
        'code' => 'NEW',
        'name' => 'New Shop',
        'address' => 'New Address',
        'phone' => '01722222222',
        'website' => 'newshop.com',
        'is_active' => false,
    ])->assertRedirect('/shops');

    $shop->refresh();
    expect($shop->code)->toBe('NEW');
    expect($shop->name)->toBe('New Shop');
    expect($shop->address)->toBe('New Address');
    expect($shop->phone)->toBe('01722222222');
    expect($shop->website)->toBe('newshop.com');
    expect($shop->is_active)->toBe(false);
});

test('shops update requires unique code', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $shop1 = Shop::factory()->create(['code' => 'SHOP1']);
    $shop2 = Shop::factory()->create(['code' => 'SHOP2']);

    actingAs($user);

    put("/shops/{$shop1->id}", [
        'code' => 'SHOP2', // Trying to use shop2's code
        'name' => 'Test Shop',
        'address' => '123 Test Street',
        'phone' => '01711234567',
        'is_active' => true,
    ])->assertSessionHasErrors('code');
});

test('shops can be deleted', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $shop = Shop::factory()->create();

    actingAs($user);

    delete("/shops/{$shop->id}")->assertRedirect('/shops');

    assertDatabaseMissing('shops', [
        'id' => $shop->id,
    ]);
});

test('shops with associated orders cannot be deleted', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');
    $shop = Shop::factory()->create();

    // Create an order associated with the shop
    Order::factory()->create(['shop_id' => $shop->id]);

    actingAs($user);

    delete("/shops/{$shop->id}")->assertRedirect('/shops')
        ->assertSessionHasErrors('error');

    assertDatabaseHas('shops', [
        'id' => $shop->id,
    ]);
});

test('shop next_order_sequence starts at 1', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    post('/shops', [
        'code' => 'TST',
        'name' => 'Test Shop',
        'address' => '123 Test Street',
        'phone' => '01711234567',
        'is_active' => true,
    ]);

    $shop = Shop::where('code', 'TST')->first();
    expect($shop->next_order_sequence)->toBe(1);
});
