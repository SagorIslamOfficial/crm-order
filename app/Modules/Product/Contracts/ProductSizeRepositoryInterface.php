<?php

namespace App\Modules\Product\Contracts;

use App\Contracts\BaseRepositoryInterface;
use App\Modules\Product\Models\ProductSize;

/**
 * @extends BaseRepositoryInterface<ProductSize>
 */
interface ProductSizeRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return array<int, array{id: string, name: string}>
     */
    public function getByProductType(string $productTypeId): array;
}
