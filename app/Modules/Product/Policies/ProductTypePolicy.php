<?php

namespace App\Modules\Product\Policies;

use App\Models\User;
use App\Modules\Product\Models\ProductType;

class ProductTypePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('product-types.view');
    }

    public function view(User $user, ProductType $productType): bool
    {
        return $user->hasPermissionTo('product-types.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('product-types.create');
    }

    public function update(User $user, ProductType $productType): bool
    {
        return $user->hasPermissionTo('product-types.update');
    }

    public function delete(User $user, ProductType $productType): bool
    {
        return $user->hasPermissionTo('product-types.delete');
    }
}
