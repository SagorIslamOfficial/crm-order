<?php

namespace App\Modules\Product\Contracts;

use App\Contracts\BaseRepositoryInterface;
use App\Modules\Product\Models\ProductType;

/**
 * @extends BaseRepositoryInterface<ProductType>
 */
interface ProductTypeRepositoryInterface extends BaseRepositoryInterface
{
    // Get all product types for dropdown.
    public function getAllForDropdown(): array;
}
