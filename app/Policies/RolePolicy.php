<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;

/**
 * @mixin \Spatie\Permission\Traits\HasRoles
 */
class RolePolicy
{
    /**
     * Determine if the user can view any roles.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('roles.view');
    }

    /**
     * Determine if the user can view a role.
     */
    public function view(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('roles.view');
    }

    /**
     * Determine if the user can create roles.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('roles.create');
    }

    /**
     * Determine if the user can update a role.
     */
    public function update(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('roles.update');
    }

    /**
     * Determine if the user can delete a role.
     */
    public function delete(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('roles.delete');
    }

    /**
     * Determine if the user can permanently delete a role.
     */
    public function forceDelete(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('roles.delete');
    }

    /**
     * Determine if the user can manage permissions for a role.
     */
    public function managePermissions(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('roles.update');
    }
}
