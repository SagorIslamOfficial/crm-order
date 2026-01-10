<?php

namespace App\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Permission;

class PermissionRepository
{
    const DEFAULT_PER_PAGE = 10;

    // Get all permissions.
    public function getAll(): Collection
    {
        return Permission::orderBy('name')->get();
    }

    // Get paginated permissions.
    public function getPaginated(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        $perPage = $perPage ?? self::DEFAULT_PER_PAGE;

        $query = Permission::with(['roles', 'users'])->orderBy('name');

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    public function findById(int $id): Permission
    {
        return Permission::findOrFail($id);
    }

    public function findByName(string $name): ?Permission
    {
        return Permission::where('name', $name)->first();
    }

    public function create(array $data): Permission
    {
        return Permission::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);
    }

    public function update(Permission $permission, array $data): Permission
    {
        $permission->update([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? $permission->guard_name,
        ]);

        return $permission->fresh();
    }

    public function delete(Permission $permission): bool
    {
        return $permission->delete();
    }

    public function getRolesCount(Permission $permission): int
    {
        return $permission->roles()->count();
    }

    public function getUsersCount(Permission $permission): int
    {
        return $permission->users()->count();
    }

    public function getPermissionWithCounts(Permission $permission): array
    {
        return [
            'id' => $permission->id,
            'name' => $permission->name,
            'guard_name' => $permission->guard_name,
            'roles_count' => $this->getRolesCount($permission),
            'users_count' => $this->getUsersCount($permission),
            'created_at' => $permission->created_at,
            'updated_at' => $permission->updated_at,
        ];
    }
}
