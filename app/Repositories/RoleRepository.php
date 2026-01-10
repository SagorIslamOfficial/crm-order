<?php

namespace App\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleRepository
{
    // Default items per page for pagination.
    const DEFAULT_PER_PAGE = 10;

    // Get all roles with their permissions.
    public function all(): Collection
    {
        return Role::with('permissions')->get();
    }

    // Get paginated roles with filters.
    public function getPaginated(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        $perPage = $perPage ?? self::DEFAULT_PER_PAGE;

        $query = Role::with(['permissions'])->withCount('users');

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    // Find a role by ID with its permissions.
    public function findById(string $id): ?Role
    {
        return Role::with('permissions')->find($id);
    }

    // Find a role by name with its permissions.
    public function findByName(string $name): ?Role
    {
        return Role::with('permissions')->where('name', $name)->first();
    }

    // Create a new role with optional permissions.
    public function create(array $data): Role
    {
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->load('permissions');
    }

    // Update a role and its permissions.
    public function update(Role $role, array $data): Role
    {
        $role->update([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->fresh('permissions');
    }

    // Delete a role, preventing deletion of the Administrator role.
    public function delete(Role $role): bool
    {
        // Prevent deletion of Administrator role
        if ($role->name === 'Administrator') {
            return false;
        }

        return $role->delete();
    }

    // Sync permissions for a role.
    public function syncPermissions(Role $role, array $permissions): void
    {
        $role->syncPermissions($permissions);
    }

    // Get all permissions.
    public function getPermissions(): Collection
    {
        return Permission::orderBy('name')->get();
    }

    // Get all roles with user count.
    public function getRolesWithUserCount(): Collection
    {
        return Role::withCount('users')->get();
    }
}
