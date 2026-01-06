<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\get;
use function Pest\Laravel\seed;
use function Pest\Laravel\withHeaders;

uses(RefreshDatabase::class);

beforeEach(function () {
    seed(RolePermissionSeeder::class);
});

// Helper function to make authenticated requests with CSRF token
function makeRequest($method, $uri, $data = [], $user = null)
{
    if ($user) {
        // Get CSRF token from a page visit
        actingAs($user);
        get('/users');
        $csrfToken = session()->token();

        actingAs($user);

        return withHeaders([
            'X-CSRF-TOKEN' => $csrfToken,
            'X-Inertia' => 'true',
            'X-Requested-With' => 'XMLHttpRequest',
        ])->{$method}($uri, array_merge($data, ['_token' => $csrfToken]));
    }

    // If no user provided, make unauthenticated request
    return call_user_func($method, $uri, $data);
}

test('users index page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    get('/users')->assertSuccessful();
});

test('users can be listed', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create(['name' => 'Admin User']);
    $admin->assignRole('Administrator');

    User::factory()->count(3)->create();

    actingAs($admin);

    get('/users')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('users.data', 4) // admin + 3 created users
        );

    // Verify the admin user is in the response
    get('/users')->assertInertia(fn ($page) => $page
        ->where('users.data', function ($users) {
            $names = collect($users)->pluck('name');

            return $names->contains('Admin User');
        })
    );
});

test('users can be searched', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $user1 = User::factory()->create(['name' => 'John Doe']);
    $user2 = User::factory()->create(['name' => 'Jane Smith']);

    actingAs($admin);

    get('/users?search=John')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'John Doe')
        );
});

test('create user page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    get('/users/create')->assertSuccessful();
});

test('user can be created', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'roles' => ['Salesperson'],
    ];

    $response = makeRequest('post', '/users', $userData, $admin);

    $response->assertRedirect('/users');
    $response->assertSessionHas('message', 'User created successfully.');

    assertDatabaseHas('users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $user = User::where('email', 'test@example.com')->first();
    expect($user->hasRole('Salesperson'))->toBeTrue();
});

test('user creation requires permission', function () {
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No users.create permission

    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'roles' => ['Salesperson'],
    ];

    $response = makeRequest('post', '/users', $userData, $user);

    $response->assertForbidden();
});

test('user creation validation works', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $response = makeRequest('post', '/users', [], $admin);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['name', 'email', 'password', 'roles']);
});

test('duplicate email is rejected', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    User::factory()->create(['email' => 'existing@example.com']);

    $userData = [
        'name' => 'Test User',
        'email' => 'existing@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'roles' => ['Salesperson'],
    ];

    $response = makeRequest('post', '/users', $userData, $admin);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['email']);
});

test('user can be viewed', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Salesperson');

    actingAs($admin);

    get("/users/{$user->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('user.name', $user->name)
            ->where('user.email', $user->email)
        );
});

test('edit user page is displayed', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    /** @var \App\Models\User $user */
    $user = User::factory()->create();

    actingAs($admin);

    get("/users/{$user->id}/edit")->assertSuccessful();
});

test('user can be updated', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $user = User::factory()->create(['name' => 'Old Name']);
    $user->assignRole('Salesperson');

    $updateData = [
        'name' => 'Updated Name',
        'email' => $user->email,
        'roles' => ['Product Manager'],
    ];

    $response = makeRequest('put', "/users/{$user->id}", $updateData, $admin);

    $response->assertRedirect('/users');
    $response->assertSessionHas('message', 'User updated successfully.');

    $user->refresh();
    expect($user->name)->toBe('Updated Name');
    expect($user->hasRole('Product Manager'))->toBeTrue();
    expect($user->hasRole('Salesperson'))->toBeFalse();
});

test('user update requires permission', function () {
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No users.update permission

    $targetUser = User::factory()->create();

    $updateData = [
        'name' => 'Updated Name',
        'email' => $targetUser->email,
        'roles' => ['Salesperson'],
    ];

    $response = makeRequest('put', "/users/{$targetUser->id}", $updateData, $user);

    $response->assertForbidden();
});

test('user cannot delete themselves', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $response = makeRequest('delete', "/users/{$admin->id}", [], $admin);

    $response->assertRedirect('/users');
    $response->assertSessionHasErrors(['error' => 'You cannot delete your own account.']);
});

test('user can be deleted', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $user = User::factory()->create();

    $response = makeRequest('delete', "/users/{$user->id}", [], $admin);

    $response->assertRedirect('/users');
    $response->assertSessionHas('message', 'User deleted successfully.');

    assertDatabaseMissing('users', ['id' => $user->id]);
});

test('user deletion requires permission', function () {
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No users.delete permission

    $targetUser = User::factory()->create();

    $response = makeRequest('delete', "/users/{$targetUser->id}", [], $user);

    $response->assertForbidden();
});
