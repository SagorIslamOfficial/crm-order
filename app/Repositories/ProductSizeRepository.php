<?php

namespace App\Repositories;

use App\Models\ProductSize;
use Illuminate\Database\Eloquent\Collection;

class ProductSizeRepository
{
    public function all(): Collection
    {
        return ProductSize::query()->get();
    }

    public function allActive(): Collection
    {
        return ProductSize::query()
            ->where('is_active', true)
            ->get();
    }

    public function allWithProductType(): Collection
    {
        return ProductSize::query()
            ->with('productType')
            ->withCount('orderItems')
            ->get();
    }

    public function findById(string $id): ?ProductSize
    {
        return ProductSize::find($id);
    }

    public function findByProductType(string $productTypeId): Collection
    {
        return ProductSize::query()
            ->where('product_type_id', $productTypeId)
            ->where('is_active', true)
            ->orderBy('size_label')
            ->get();
    }

    public function create(array $data): ProductSize
    {
        return ProductSize::create($data);
    }

    public function update(ProductSize $productSize, array $data): bool
    {
        return $productSize->update($data);
    }

    public function delete(ProductSize $productSize): bool
    {
        return $productSize->delete();
    }
}
