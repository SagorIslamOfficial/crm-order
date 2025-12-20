<?php

namespace App\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Role;

class RoleRepository
{
    public function all(): Collection
    {
        return Role::with('permissions')->get();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Role::with('permissions')->paginate($perPage);
    }

    public function findById(string $id): ?Role
    {
        return Role::with('permissions')->find($id);
    }

    public function findByName(string $name): ?Role
    {
        return Role::with('permissions')->where('name', $name)->first();
    }

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

    public function delete(Role $role): bool
    {
        // Prevent deletion of Administrator role
        if ($role->name === 'Administrator') {
            return false;
        }

        return $role->delete();
    }

    public function syncPermissions(Role $role, array $permissions): void
    {
        $role->syncPermissions($permissions);
    }

    public function getPermissions(): Collection
    {
        return \Spatie\Permission\Models\Permission::all();
    }

    public function getRolesWithUserCount(): Collection
    {
        return Role::withCount('users')->get();
    }
}
