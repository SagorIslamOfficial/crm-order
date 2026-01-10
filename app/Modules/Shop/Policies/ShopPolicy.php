<?php

namespace App\Modules\Shop\Policies;

use App\Models\User;
use App\Modules\Shop\Models\Shop;

/**
 * @mixin \Spatie\Permission\Traits\HasRoles
 */
class ShopPolicy
{
    /**
     * Determine if the user can view any shops.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('shops.view');
    }

    /**
     * Determine if the user can view a shop.
     */
    public function view(User $user, Shop $shop): bool
    {
        return $user->hasPermissionTo('shops.view');
    }

    /**
     * Determine if the user can create shops.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('shops.create');
    }

    /**
     * Determine if the user can update a shop.
     */
    public function update(User $user, Shop $shop): bool
    {
        return $user->hasPermissionTo('shops.update');
    }

    /**
     * Determine if the user can delete a shop.
     */
    public function delete(User $user, Shop $shop): bool
    {
        return $user->hasPermissionTo('shops.delete');
    }

    /**
     * Determine if the user can permanently delete a shop.
     */
    public function forceDelete(User $user, Shop $shop): bool
    {
        return $user->hasPermissionTo('shops.delete');
    }
}
