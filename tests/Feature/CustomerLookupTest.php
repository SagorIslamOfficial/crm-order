<?php

use App\Models\User;
use App\Modules\Customer\Models\Customer;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

test('it returns customer when found by phone', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $customer = Customer::factory()->create([
        'phone' => '01712345678',
        'name' => 'John Doe',
        'address' => '123 Main St',
    ]);

    actingAs($user);

    getJson('/api/customers/lookup?phone=01712345678')
        ->assertOk()
        ->assertJson([
            'found' => true,
            'customer' => [
                'id' => $customer->id,
                'name' => 'John Doe',
                'phone' => '01712345678',
                'address' => '123 Main St',
            ],
        ]);
});

test('it returns not found when customer does not exist', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();

    actingAs($user);

    getJson('/api/customers/lookup?phone=01799999999')
        ->assertNotFound()
        ->assertJson([
            'found' => false,
            'message' => 'Customer not found',
        ]);
});

test('it validates phone number is required', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();

    actingAs($user);

    getJson('/api/customers/lookup')
        ->assertStatus(422)
        ->assertJsonValidationErrors('phone');
});

test('it validates phone number must be 11 digits', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();

    actingAs($user);

    getJson('/api/customers/lookup?phone=123')
        ->assertStatus(422)
        ->assertJsonValidationErrors('phone');
});

test('it requires authentication', function () {
    getJson('/api/customers/lookup?phone=01712345678')
        ->assertUnauthorized();
});
