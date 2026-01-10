<?php

namespace App\Modules\Product\Policies;

use App\Models\User;
use App\Modules\Product\Models\ProductType;

/**
 * @mixin \Spatie\Permission\Traits\HasRoles
 */
class ProductTypePolicy
{
    /**
     * Determine if the user can view any product types.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('product-types.view');
    }

    /**
     * Determine if the user can view a product type.
     */
    public function view(User $user, ProductType $productType): bool
    {
        return $user->hasPermissionTo('product-types.view');
    }

    /**
     * Determine if the user can create product types.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('product-types.create');
    }

    /**
     * Determine if the user can update a product type.
     */
    public function update(User $user, ProductType $productType): bool
    {
        return $user->hasPermissionTo('product-types.update');
    }

    /**
     * Determine if the user can delete a product type.
     */
    public function delete(User $user, ProductType $productType): bool
    {
        return $user->hasPermissionTo('product-types.delete');
    }

    /**
     * Determine if the user can permanently delete a product type.
     */
    public function forceDelete(User $user, ProductType $productType): bool
    {
        return $user->hasPermissionTo('product-types.delete');
    }
}
