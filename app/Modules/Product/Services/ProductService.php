<?php

namespace App\Modules\Product\Services;

use App\Modules\Product\Contracts\ProductServiceInterface;
use App\Modules\Product\Contracts\ProductSizeRepositoryInterface;
use App\Modules\Product\Contracts\ProductTypeRepositoryInterface;
use App\Modules\Product\Models\ProductSize;
use App\Modules\Product\Models\ProductType;
use Illuminate\Support\Facades\DB;

class ProductService implements ProductServiceInterface
{
    public function __construct(
        private ProductTypeRepositoryInterface $productTypeRepository,
        private ProductSizeRepositoryInterface $productSizeRepository,
    ) {}

    /**
     * Create a new product type.
     *
     * @throws \Throwable
     */
    public function createProductType(array $data): ProductType
    {
        return DB::transaction(function () use ($data) {
            return $this->productTypeRepository->create($data);
        });
    }

    /**
     * Update an existing product type.
     *
     * @throws \Throwable
     */
    public function updateProductType(ProductType $productType, array $data): ProductType
    {
        return DB::transaction(function () use ($productType, $data) {
            $this->productTypeRepository->update($productType, $data);

            return $productType->fresh();
        });
    }

    /**
     * Delete a product type.
     */
    public function deleteProductType(ProductType $productType): bool
    {
        return $this->productTypeRepository->delete($productType);
    }

    /**
     * Create a new product size.
     *
     * @throws \Throwable
     */
    public function createProductSize(array $data): ProductSize
    {
        return DB::transaction(function () use ($data) {
            return $this->productSizeRepository->create($data);
        });
    }

    /**
     * Update an existing product size.
     *
     * @throws \Throwable
     */
    public function updateProductSize(ProductSize $productSize, array $data): ProductSize
    {
        return DB::transaction(function () use ($productSize, $data) {
            $this->productSizeRepository->update($productSize, $data);

            return $productSize->fresh();
        });
    }

    /**
     * Delete a product size.
     */
    public function deleteProductSize(ProductSize $productSize): bool
    {
        return $this->productSizeRepository->delete($productSize);
    }
}
