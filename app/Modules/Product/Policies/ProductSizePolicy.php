<?php

namespace App\Modules\Product\Policies;

use App\Models\User;
use App\Modules\Product\Models\ProductSize;

/**
 * @mixin \Spatie\Permission\Traits\HasRoles
 */
class ProductSizePolicy
{
    /**
     * Determine if the user can view any product sizes.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('product-sizes.view');
    }

    /**
     * Determine if the user can view a product size.
     */
    public function view(User $user, ProductSize $productSize): bool
    {
        return $user->hasPermissionTo('product-sizes.view');
    }

    /**
     * Determine if the user can create product sizes.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('product-sizes.create');
    }

    /**
     * Determine if the user can update a product size.
     */
    public function update(User $user, ProductSize $productSize): bool
    {
        return $user->hasPermissionTo('product-sizes.update');
    }

    /**
     * Determine if the user can delete a product size.
     */
    public function delete(User $user, ProductSize $productSize): bool
    {
        return $user->hasPermissionTo('product-sizes.delete');
    }

    /**
     * Determine if the user can permanently delete a product size.
     */
    public function forceDelete(User $user, ProductSize $productSize): bool
    {
        return $user->hasPermissionTo('product-sizes.delete');
    }
}
