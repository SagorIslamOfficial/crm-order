<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
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

test('roles index page is displayed', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    actingAs($user);

    get('/roles')->assertSuccessful();
});

test('roles can be listed', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    actingAs($admin);

    get('/roles')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('roles.data', 6) // Administrator, Salesperson, Product Manager, Quantity Manager, Production Manager, Quality Controller
        );
});

test('role can be created', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    // Get CSRF token
    actingAs($admin);
    get('/users');
    $csrfToken = session()->token();

    $roleData = [
        'name' => 'Test Role',
        'permissions' => ['users.create', 'users.view'],
        '_token' => $csrfToken,
    ];

    actingAs($admin);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->post('/roles', $roleData)
        ->assertRedirect('/roles')
        ->assertSessionHas('message', 'Role created successfully.');

    assertDatabaseHas('roles', [
        'name' => 'Test Role',
    ]);
});

test('role creation requires permission', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No roles.create permission

    // Get CSRF token
    actingAs($user);
    get('/users');
    $csrfToken = session()->token();

    $roleData = [
        'name' => 'Test Role',
        'permissions' => ['users.view'],
        '_token' => $csrfToken,
    ];

    actingAs($user);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->post('/roles', $roleData)
        ->assertForbidden();
});

test('role can be viewed', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $role = Role::where('name', 'Salesperson')->first();

    actingAs($admin);

    get("/roles/{$role->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('role.name', 'Salesperson')
        );
});

test('role can be updated', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $role = Role::where('name', 'Salesperson')->first();

    // Get CSRF token
    actingAs($admin);
    get('/users');
    $csrfToken = session()->token();

    $updateData = [
        'name' => 'Updated Salesperson',
        'permissions' => ['users.view', 'users.update'],
        '_token' => $csrfToken,
    ];

    actingAs($admin);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->put("/roles/{$role->id}", $updateData)
        ->assertRedirect('/roles')
        ->assertSessionHas('message', 'Role updated successfully.');

    $role->refresh();
    expect($role->name)->toBe('Updated Salesperson');
    expect($role->hasPermissionTo('users.view'))->toBeTrue();
    expect($role->hasPermissionTo('users.update'))->toBeTrue();
});

test('role update requires permission', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No roles.update permission

    $role = Role::where('name', 'Product Manager')->first();

    // Get CSRF token
    actingAs($user);
    get('/users');
    $csrfToken = session()->token();

    $updateData = [
        'name' => 'Updated Role',
        'permissions' => ['users.view'],
        '_token' => $csrfToken,
    ];

    actingAs($user);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->put("/roles/{$role->id}", $updateData)
        ->assertForbidden();
});

test('role can be deleted', function () {
    /** @var \App\Models\User $admin */
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $role = Role::where('name', 'Quality Controller')->first();

    // Get CSRF token
    actingAs($admin);
    get('/users');
    $csrfToken = session()->token();

    actingAs($admin);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->delete("/roles/{$role->id}", ['_token' => $csrfToken])
        ->assertRedirect('/roles')
        ->assertSessionHas('message', 'Role deleted successfully.');

    assertDatabaseMissing('roles', ['id' => $role->id]);
});

test('role deletion requires permission', function () {
    /** @var \App\Models\User $user */
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No roles.delete permission

    $role = Role::where('name', 'Product Manager')->first();

    // Get CSRF token
    actingAs($user);
    get('/users');
    $csrfToken = session()->token();

    actingAs($user);

    withHeaders([
        'X-CSRF-TOKEN' => $csrfToken,
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
    ])->delete("/roles/{$role->id}", ['_token' => $csrfToken])
        ->assertForbidden();
});
