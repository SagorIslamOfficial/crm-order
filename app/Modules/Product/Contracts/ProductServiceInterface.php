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

    /**
     * Transform product type for API response.
     *
     * @return array<string, mixed>
     */
    public function transformProductTypeForResponse(ProductType $productType): array;

    /**
     * Transform product size for API response.
     *
     * @return array<string, mixed>
     */
    public function transformProductSizeForResponse(ProductSize $productSize): array;

    /**
     * Transform product type for list view.
     *
     * @return array<string, mixed>
     */
    public function transformProductTypeForList(ProductType $productType): array;

    /**
     * Transform product size for list view.
     *
     * @return array<string, mixed>
     */
    public function transformProductSizeForList(ProductSize $productSize): array;

    /**
     * Transform product type for lookup/dropdown.
     *
     * @return array<string, mixed>
     */
    public function transformProductTypeForLookup(ProductType $productType): array;

    /**
     * Transform product size for lookup/dropdown.
     *
     * @return array<string, mixed>
     */
    public function transformProductSizeForLookup(ProductSize $productSize): array;

    /**
     * Get product type with sizes for detailed view.
     *
     * @return array<string, mixed>
     */
    public function getProductTypeWithSizes(string $productTypeId): array;

    /**
     * Get product size with product type for detailed view.
     *
     * @return array<string, mixed>
     */
    public function getProductSizeWithType(string $productSizeId): array;

    /**
     * Format currency amount.
     */
    public function formatCurrency(float $amount): string;

    /**
     * Format date for display.
     */
    public function formatDate(string $date): string;
}
