<?php

namespace App\Modules\Product\Contracts;

use App\Contracts\BaseRepositoryInterface;
use App\Modules\Product\Models\ProductType;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepositoryInterface<ProductType>
 */
interface ProductTypeRepositoryInterface extends BaseRepositoryInterface
{
    // Get all product types for dropdown.
    public function getAllForDropdown(): array;

    /**
     * @return LengthAwarePaginator<ProductType>
     */
    public function getPaginatedWithFilters(?int $perPage = null, array $filters = []): LengthAwarePaginator;
}
