<?php

namespace App\Modules\Shop\Policies;

use App\Models\User;
use App\Modules\Shop\Models\Shop;

class ShopPolicy
{
    // Determine whether the user can view any shops.
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('shops.view');
    }

    // Determine whether the user can view a specific shop.
    public function view(User $user, Shop $shop): bool
    {
        return $user->hasPermissionTo('shops.view');
    }

    // Determine whether the user can create shops.
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('shops.create');
    }

    // Determine whether the user can update a specific shop.
    public function update(User $user, Shop $shop): bool
    {
        return $user->hasPermissionTo('shops.update');
    }

    // Determine whether the user can delete a specific shop.
    public function delete(User $user, Shop $shop): bool
    {
        return $user->hasPermissionTo('shops.delete');
    }
}
