<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Traits\MakesAuthenticatedRequests;

uses(RefreshDatabase::class, MakesAuthenticatedRequests::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('roles index page is displayed', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    $response = $this->actingAs($user)->get('/roles');

    $response->assertSuccessful();
});

test('roles can be listed', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $response = $this->actingAs($admin)->get('/roles');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->has('roles.data', 6) // Administrator, Salesperson, Product Manager, Quantity Manager, Production Manager, Quality Controller
    );
});

test('role can be created', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $roleData = [
        'name' => 'Test Role',
        'permissions' => ['users.create', 'users.view'],
    ];

    $response = makeRequest('post', '/roles', $roleData, $admin);

    $response->assertRedirect('/roles');
    $response->assertSessionHas('message', 'Role created successfully.');

    $this->assertDatabaseHas('roles', [
        'name' => 'Test Role',
    ]);
});

test('role creation requires permission', function () {
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No roles.create permission

    $roleData = [
        'name' => 'Test Role',
        'permissions' => ['users.view'],
    ];

    $response = makeRequest('post', '/roles', $roleData, $user);

    $response->assertForbidden();
});

test('role can be viewed', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $role = \Spatie\Permission\Models\Role::where('name', 'Salesperson')->first();

    $response = $this->actingAs($admin)->get("/roles/{$role->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('role.name', 'Salesperson')
    );
});

test('role can be updated', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $role = \Spatie\Permission\Models\Role::where('name', 'Salesperson')->first();

    $updateData = [
        'name' => 'Updated Salesperson',
        'permissions' => ['users.view', 'users.update'],
    ];

    $response = makeRequest('put', "/roles/{$role->id}", $updateData, $admin);

    $response->assertRedirect('/roles');
    $response->assertSessionHas('message', 'Role updated successfully.');

    $role->refresh();
    expect($role->name)->toBe('Updated Salesperson');
    expect($role->hasPermissionTo('users.view'))->toBeTrue();
    expect($role->hasPermissionTo('users.update'))->toBeTrue();
});

test('role update requires permission', function () {
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No roles.update permission

    $role = \Spatie\Permission\Models\Role::where('name', 'Product Manager')->first();

    $updateData = [
        'name' => 'Updated Role',
        'permissions' => ['users.view'],
    ];

    $response = makeRequest('put', "/roles/{$role->id}", $updateData, $user);

    $response->assertForbidden();
});

test('role can be deleted', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $role = \Spatie\Permission\Models\Role::where('name', 'Quality Controller')->first();

    $response = makeRequest('delete', "/roles/{$role->id}", [], $admin);

    $response->assertRedirect('/roles');
    $response->assertSessionHas('message', 'Role deleted successfully.');

    $this->assertDatabaseMissing('roles', ['id' => $role->id]);
});

test('role deletion requires permission', function () {
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No roles.delete permission

    $role = \Spatie\Permission\Models\Role::where('name', 'Product Manager')->first();

    $response = makeRequest('delete', "/roles/{$role->id}", [], $user);

    $response->assertForbidden();
});
