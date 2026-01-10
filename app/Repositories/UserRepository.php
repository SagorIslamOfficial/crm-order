<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Role;

class UserRepository
{
    // Default items per page for pagination.
    const DEFAULT_PER_PAGE = 10;

    //  Get all users.
    public function all(): Collection
    {
        return User::query()->get();
    }

    // Search users by name or email and paginate results.
    public function searchAndPaginate(?string $search, ?int $perPage = null): LengthAwarePaginator
    {
        $perPage = $perPage ?? self::DEFAULT_PER_PAGE;

        $query = User::query()
            ->with(['roles.permissions'])
            ->orderBy('name');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    // Get paginated users with filters.
    public function getPaginated(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        $perPage = $perPage ?? self::DEFAULT_PER_PAGE;

        $query = User::query()
            ->with(['roles.permissions'])
            ->orderBy('name');

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    // Find a user by ID with roles.
    public function findById(string $id): ?User
    {
        return User::with('roles')->find($id);
    }

    // Find a user by email.
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    // Create a new user.
    public function create(array $data): User
    {
        return User::create($data);
    }

    // Update a user.
    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }

    // Delete a user.
    public function delete(User $user): bool
    {
        return $user->delete();
    }

    // Assign a role to a user.
    public function assignRole(User $user, string $role): void
    {
        $user->assignRole($role);
    }

    // Remove a role from a user.
    public function removeRole(User $user, string $role): void
    {
        $user->removeRole($role);
    }

    // Sync roles for a user.
    public function syncRoles(User $user, array $roles): void
    {
        $user->syncRoles($roles);
    }

    // Get all roles.
    public function getRoles(): Collection
    {
        return Role::all();
    }
}
