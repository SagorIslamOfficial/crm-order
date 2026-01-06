<?php

namespace App\Modules\Product\Policies;

use App\Models\User;
use App\Modules\Product\Models\ProductSize;

class ProductSizePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('product-sizes.view');
    }

    public function view(User $user, ProductSize $productSize): bool
    {
        return $user->hasPermissionTo('product-sizes.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('product-sizes.create');
    }

    public function update(User $user, ProductSize $productSize): bool
    {
        return $user->hasPermissionTo('product-sizes.update');
    }

    public function delete(User $user, ProductSize $productSize): bool
    {
        return $user->hasPermissionTo('product-sizes.delete');
    }
}
