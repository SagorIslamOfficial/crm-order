<?php

namespace App\Policies;

use App\Models\User;

/**
 * @mixin \Spatie\Permission\Traits\HasRoles
 */
class UserPolicy
{
    /**
     * Determine if the user can view any users.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('users.view');
    }

    /**
     * Determine if the user can view another user.
     */
    public function view(User $user, User $targetUser): bool
    {
        return $user->hasPermissionTo('users.view');
    }

    /**
     * Determine if the user can create users.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('users.create');
    }

    /**
     * Determine if the user can update another user.
     */
    public function update(User $user, User $targetUser): bool
    {
        return $user->hasPermissionTo('users.update');
    }

    /**
     * Determine if the user can delete another user.
     */
    public function delete(User $user, User $targetUser): bool
    {
        return $user->hasPermissionTo('users.delete');
    }

    /**
     * Determine if the user can permanently delete another user.
     */
    public function forceDelete(User $user, User $targetUser): bool
    {
        return $user->hasPermissionTo('users.delete');
    }

    /**
     * Determine if the user can manage roles for another user.
     */
    public function manageRoles(User $user, User $targetUser): bool
    {
        return $user->hasPermissionTo('users.update');
    }
}
