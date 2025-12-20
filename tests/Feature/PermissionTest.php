<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Traits\MakesAuthenticatedRequests;

uses(RefreshDatabase::class, MakesAuthenticatedRequests::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('permissions index page is displayed', function () {
    $user = User::factory()->create();
    $user->assignRole('Administrator');

    $response = $this->actingAs($user)->get('/permissions');

    $response->assertSuccessful();
});

test('permissions can be listed', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $response = $this->actingAs($admin)->get('/permissions');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->has('permissions.data', 15) // Should have 15 permissions per page (pagination)
    );
});

test('permission can be created', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $permissionData = [
        'name' => 'test.custom',
    ];

    $response = makeRequest('post', '/permissions', $permissionData, $admin);

    $response->assertRedirect('/permissions');
    $response->assertSessionHas('message', 'Permission created successfully.');

    $this->assertDatabaseHas('permissions', [
        'name' => 'test.custom',
    ]);
});

test('permission creation requires permission', function () {
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No permissions.create permission

    $permissionData = [
        'name' => 'test.custom',
    ];

    $response = makeRequest('post', '/permissions', $permissionData, $user);

    $response->assertForbidden();
});

test('permission creation validates name format', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $permissionData = [
        'name' => 'invalid name with spaces',
    ];

    $response = makeRequest('post', '/permissions', $permissionData, $admin);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['name']);
});

test('permission can be viewed', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $permission = \Spatie\Permission\Models\Permission::where('name', 'users.view')->first();

    $response = $this->actingAs($admin)->get("/permissions/{$permission->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('permission.name', 'users.view')
    );
});

test('permission can be updated', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $permission = \Spatie\Permission\Models\Permission::where('name', 'users.view')->first();

    $updateData = [
        'name' => 'users.read',
    ];

    $response = makeRequest('put', "/permissions/{$permission->id}", $updateData, $admin);

    $response->assertRedirect('/permissions');
    $response->assertSessionHas('message', 'Permission updated successfully.');

    $permission->refresh();
    expect($permission->name)->toBe('users.read');
});

test('permission update requires permission', function () {
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No permissions.update permission

    $permission = \Spatie\Permission\Models\Permission::where('name', 'users.view')->first();

    $updateData = [
        'name' => 'users.read',
    ];

    $response = makeRequest('put', "/permissions/{$permission->id}", $updateData, $user);

    $response->assertForbidden();
});

test('permission can be deleted', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    // Create a test permission that won't be assigned to any roles
    $permission = \Spatie\Permission\Models\Permission::create(['name' => 'test.permission']);

    $response = makeRequest('delete', "/permissions/{$permission->id}", [], $admin);

    $response->assertRedirect('/permissions');
    $response->assertSessionHas('message', 'Permission deleted successfully.');

    $this->assertDatabaseMissing('permissions', ['id' => $permission->id]);
});

test('permission deletion requires permission', function () {
    $user = User::factory()->create();
    $user->assignRole('Salesperson'); // No permissions.delete permission

    $permission = \Spatie\Permission\Models\Permission::where('name', 'users.view')->first();

    $response = makeRequest('delete', "/permissions/{$permission->id}", [], $user);

    $response->assertForbidden();
});

test('permission cannot be deleted if assigned to roles', function () {
    $admin = User::factory()->create();
    $admin->assignRole('Administrator');

    $permission = \Spatie\Permission\Models\Permission::where('name', 'users.view')->first();

    $response = makeRequest('delete', "/permissions/{$permission->id}", [], $admin);

    $response->assertRedirect('/permissions');
    $response->assertSessionHasErrors(['error' => 'Cannot delete permission that is assigned to roles. Please remove from roles first.']);
});
