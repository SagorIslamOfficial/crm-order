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
    // Added repository interfaces
    public function __construct(
        private ProductTypeRepositoryInterface $productTypeRepository,
        private ProductSizeRepositoryInterface $productSizeRepository,
    ) {}

    // Create product type
    public function createProductType(array $data): ProductType
    {
        return DB::transaction(function () use ($data) {
            return $this->productTypeRepository->create($data);
        });
    }

    // Update product type
    public function updateProductType(ProductType $productType, array $data): ProductType
    {
        return DB::transaction(function () use ($productType, $data) {
            $this->productTypeRepository->update($productType, $data);

            return $productType->fresh();
        });
    }

    // Delete product type
    public function deleteProductType(ProductType $productType): bool
    {
        return $this->productTypeRepository->delete($productType);
    }

    // Create product size
    public function createProductSize(array $data): ProductSize
    {
        return DB::transaction(function () use ($data) {
            return $this->productSizeRepository->create($data);
        });
    }

    // Update product size
    public function updateProductSize(ProductSize $productSize, array $data): ProductSize
    {
        return DB::transaction(function () use ($productSize, $data) {
            $this->productSizeRepository->update($productSize, $data);

            return $productSize->fresh();
        });
    }

    // Delete product size
    public function deleteProductSize(ProductSize $productSize): bool
    {
        return $this->productSizeRepository->delete($productSize);
    }

    // Transform product type for API response
    public function transformProductTypeForResponse(ProductType $productType): array
    {
        return [
            'id' => $productType->id,
            'name' => $productType->name,
            'description' => $productType->description,
            'is_active' => $productType->is_active,
            'sizes_count' => $productType->sizes_count ?? $productType->sizes->count(),
            'orders_count' => $productType->orders_count ?? $this->calculateOrdersCount($productType),
            'created_at' => $productType->created_at->format('Y-m-d'),
            'updated_at' => $productType->updated_at->format('Y-m-d'),
        ];
    }

    // Transform product size for API response
    public function transformProductSizeForResponse(ProductSize $productSize): array
    {
        return [
            'id' => $productSize->id,
            'product_type_id' => $productSize->product_type_id,
            'size_label' => $productSize->size_label,

            'is_active' => $productSize->is_active,
            'product_type' => $productSize->product_type ? [
                'id' => $productSize->product_type->id,
                'name' => $productSize->product_type->name,
            ] : null,
            'created_at' => $this->formatDate($productSize->created_at),
            'updated_at' => $this->formatDate($productSize->updated_at),
        ];
    }

    // Transform product type for list view
    public function transformProductTypeForList(ProductType $productType): array
    {
        return [
            'id' => $productType->id,
            'name' => $productType->name,
            'description' => $productType->description,
            'is_active' => $productType->is_active,
            'sizes_count' => $productType->sizes_count ?? $productType->sizes->count(),
            'created_at' => $this->formatDate($productType->created_at),
        ];
    }

    // Transform product size for list view
    public function transformProductSizeForList(ProductSize $productSize): array
    {
        return [
            'id' => $productSize->id,
            'size_label' => $productSize->size_label,

            'is_active' => $productSize->is_active,
            'product_type' => $productSize->product_type ? [
                'id' => $productSize->product_type->id,
                'name' => $productSize->product_type->name,
            ] : null,
            'created_at' => $this->formatDate($productSize->created_at),
        ];
    }

    // Transform product type for lookup/dropdown
    public function transformProductTypeForLookup(ProductType $productType): array
    {
        return [
            'id' => $productType->id,
            'name' => $productType->name,
            'description' => $productType->description,
            'is_active' => $productType->is_active,
        ];
    }

    // Transform product size for lookup/dropdown
    public function transformProductSizeForLookup(ProductSize $productSize): array
    {
        return [
            'id' => $productSize->id,
            'size_label' => $productSize->size_label,

            'product_type_id' => $productSize->product_type_id,
        ];
    }

    // Get product type with sizes for detailed view
    public function getProductTypeWithSizes(string $productTypeId): array
    {
        $productType = $this->productTypeRepository->find($productTypeId);

        if (! $productType) {
            return [];
        }

        $productType->load('sizes');

        return $this->transformProductTypeForResponse($productType) + [
            'sizes' => $productType->sizes->map(fn ($size) => $this->transformProductSizeForList($size))->toArray(),
        ];
    }

    // Get product size with product type for detailed view
    public function getProductSizeWithType(string $productSizeId): array
    {
        $productSize = $this->productSizeRepository->find($productSizeId);

        if (! $productSize) {
            return [];
        }

        $productSize->load('productType');

        return $this->transformProductSizeForResponse($productSize);
    }

    // Format currency amount
    public function formatCurrency(float $amount): string
    {
        return number_format($amount, 2);
    }

    // Format date for display
    public function formatDate(string $date): string
    {
        return date('M d, Y', strtotime($date));
    }

    // Calculate orders count for a product type
    private function calculateOrdersCount(ProductType $productType): int
    {
        return $productType->sizes()
            ->with('orderItems')
            ->get()
            ->pluck('orderItems.*.order_id')
            ->flatten()
            ->unique()
            ->count();
    }
}
