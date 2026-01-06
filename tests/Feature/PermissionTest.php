<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\Traits\MakesAuthenticatedRequests;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\get;
use function Pest\Laravel\seed;
use function Pest\Laravel\withHeaders;

uses(RefreshDatabase::class, MakesAuthenticatedRequests::class);

beforeEach(function () {
    seed(RolePermissionSeeder::class);
});

test('permissions index page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    get('/permissions')->assertSuccessful();
});

test('permissions can be listed', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    actingAs($admin);

    get('/permissions')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('permissions.data', 10)
        );
});

test('permission can be created', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    // Get CSRF token
    actingAs($admin);
    get('/users');
    $csrfToken = session()->token();

    $permissionData = [
        'name' => 'test.custom',
        '_token' => $csrfToken,
    ];

    actingAs($admin);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->post('/permissions', $permissionData)
        ->assertRedirect('/permissions')
        ->assertSessionHas('message', 'Permission created successfully.');

    assertDatabaseHas('permissions', [
        'name' => 'test.custom',
    ]);
});

test('permission creation requires permission', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No permissions.create permission

    // Get CSRF token
    actingAs($user);
    get('/users');
    $csrfToken = session()->token();

    $permissionData = [
        'name' => 'test.custom',
        '_token' => $csrfToken,
    ];

    actingAs($user);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->post('/permissions', $permissionData)
        ->assertForbidden();
});

test('permission creation validates name format', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    // Get CSRF token
    actingAs($admin);
    get('/users');
    $csrfToken = session()->token();

    $permissionData = [
        'name' => 'invalid name with spaces',
        '_token' => $csrfToken,
    ];

    actingAs($admin);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->post('/permissions', $permissionData)
        ->assertRedirect()
        ->assertSessionHasErrors(['name']);
});

test('permission can be viewed', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $permission = Permission::where('name', 'users.view')->first();

    actingAs($admin);

    get("/permissions/{$permission->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('permission.name', 'users.view')
        );
});

test('permission can be updated', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $permission = Permission::where('name', 'users.view')->first();

    // Get CSRF token
    actingAs($admin);
    get('/users');
    $csrfToken = session()->token();

    $updateData = [
        'name' => 'users.read',
        '_token' => $csrfToken,
    ];

    actingAs($admin);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->put("/permissions/{$permission->id}", $updateData)
        ->assertRedirect('/permissions')
        ->assertSessionHas('message', 'Permission updated successfully.');

    $permission->refresh();
    expect($permission->name)->toBe('users.read');
});

test('permission update requires permission', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No permissions.update permission

    $permission = Permission::where('name', 'users.view')->first();

    // Get CSRF token
    actingAs($user);
    get('/users');
    $csrfToken = session()->token();

    $updateData = [
        'name' => 'users.read',
        '_token' => $csrfToken,
    ];

    actingAs($user);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->put("/permissions/{$permission->id}", $updateData)
        ->assertForbidden();
});

test('permission can be deleted', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    // Create a test permission that won't be assigned to any roles
    $permission = Permission::create(['name' => 'test.permission']);

    // Get CSRF token
    actingAs($admin);
    get('/users');
    $csrfToken = session()->token();

    actingAs($admin);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->delete("/permissions/{$permission->id}", ['_token' => $csrfToken])
        ->assertRedirect('/permissions')
        ->assertSessionHas('message', 'Permission deleted successfully.');

    assertDatabaseMissing('permissions', ['id' => $permission->id]);
});

test('permission deletion requires permission', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No permissions.delete permission

    $permission = Permission::where('name', 'users.view')->first();

    // Get CSRF token
    actingAs($user);
    get('/users');
    $csrfToken = session()->token();

    actingAs($user);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->delete("/permissions/{$permission->id}", ['_token' => $csrfToken])
        ->assertForbidden();
});

test('permission cannot be deleted if assigned to roles', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $permission = Permission::where('name', 'users.view')->first();

    // Get CSRF token
    actingAs($admin);
    get('/users');
    $csrfToken = session()->token();

    actingAs($admin);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->delete("/permissions/{$permission->id}", ['_token' => $csrfToken])
        ->assertRedirect('/permissions')
        ->assertSessionHasErrors(['error' => 'Cannot delete permission that is assigned to roles. Please remove from roles first.']);
});
