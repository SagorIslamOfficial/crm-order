<?php

namespace App\Repositories;

use Spatie\Permission\Models\Permission;

class PermissionRepository
{
    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return Permission::orderBy('name')->get();
    }

    public function getPaginated(int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return Permission::orderBy('name')->paginate($perPage);
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
        ]);
    }

    public function update(Permission $permission, array $data): Permission
    {
        $permission->update([
            'name' => $data['name'],
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
            'roles_count' => $this->getRolesCount($permission),
            'users_count' => $this->getUsersCount($permission),
            'created_at' => $permission->created_at,
            'updated_at' => $permission->updated_at,
        ];
    }
}
