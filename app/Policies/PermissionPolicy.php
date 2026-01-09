<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Permission;

/**
 * @mixin \Spatie\Permission\Traits\HasRoles
 */
class PermissionPolicy
{
    /**
     * Determine if the user can view any permissions.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('permissions.view');
    }

    /**
     * Determine if the user can view a permission.
     */
    public function view(User $user, Permission $permission): bool
    {
        return $user->hasPermissionTo('permissions.view');
    }

    /**
     * Determine if the user can create permissions.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('permissions.create');
    }

    /**
     * Determine if the user can update a permission.
     */
    public function update(User $user, Permission $permission): bool
    {
        return $user->hasPermissionTo('permissions.update');
    }

    /**
     * Determine if the user can delete a permission.
     */
    public function delete(User $user, Permission $permission): bool
    {
        return $user->hasPermissionTo('permissions.delete');
    }

    /**
     * Determine if the user can permanently delete a permission.
     */
    public function forceDelete(User $user, Permission $permission): bool
    {
        return $user->hasPermissionTo('permissions.delete');
    }
}
