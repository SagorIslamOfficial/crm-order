<?php

namespace App\Repositories;

use App\Models\ProductType;
use Illuminate\Database\Eloquent\Collection;

class ProductTypeRepository
{
    public function all(): Collection
    {
        return ProductType::query()->get();
    }

    public function allActive(): Collection
    {
        return ProductType::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function allActiveWithSizes(): Collection
    {
        return ProductType::query()
            ->where('is_active', true)
            ->with(['sizes' => function ($query) {
                $query->where('is_active', true)
                    ->orderBy('size_label');
            }])
            ->orderBy('name')
            ->get();
    }

    public function allWithSizes(): Collection
    {
        return ProductType::query()
            ->with(['sizes' => function ($query) {
                $query->orderBy('size_label');
            }])
            ->withCount('orderItems')
            ->orderBy('name')
            ->get();
    }

    public function findById(string $id): ?ProductType
    {
        return ProductType::find($id);
    }

    public function create(array $data): ProductType
    {
        return ProductType::create($data);
    }

    public function update(ProductType $productType, array $data): bool
    {
        return $productType->update($data);
    }

    public function delete(ProductType $productType): bool
    {
        return $productType->delete();
    }
}
