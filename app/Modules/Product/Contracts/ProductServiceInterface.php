<?php

namespace App\Modules\Product\Contracts;

use App\Modules\Product\Models\ProductSize;
use App\Modules\Product\Models\ProductType;

interface ProductServiceInterface
{
    /**
     * Create a new product type.
     *
     * @param  array<string, mixed>  $data
     */
    public function createProductType(array $data): ProductType;

    /**
     * Update an existing product type.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateProductType(ProductType $productType, array $data): ProductType;

    /**
     * Delete a product type.
     */
    public function deleteProductType(ProductType $productType): bool;

    /**
     * Create a new product size.
     *
     * @param  array<string, mixed>  $data
     */
    public function createProductSize(array $data): ProductSize;

    /**
     * Update an existing product size.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateProductSize(ProductSize $productSize, array $data): ProductSize;

    /**
     * Delete a product size.
     */
    public function deleteProductSize(ProductSize $productSize): bool;
}
