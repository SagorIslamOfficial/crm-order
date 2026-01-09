<?php

namespace App\Modules\Product\Repositories;

use App\Modules\Product\Contracts\ProductTypeRepositoryInterface;
use App\Modules\Product\Models\ProductType;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<ProductType>
 */
class ProductTypeRepository extends BaseRepository implements ProductTypeRepositoryInterface
{
    /**
     * Get the model class name.
     */
    protected function model(): string
    {
        return ProductType::class;
    }

    /**
     * @return LengthAwarePaginator<ProductType>
     */
    public function getPaginated(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        return $this->getPaginatedWithFilters($perPage, $filters);
    }

    /**
     * @return LengthAwarePaginator<ProductType>
     */
    public function getPaginatedWithFilters(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        $perPage = $this->getPerPage($perPage);

        $query = $this->query()->with('sizes.orderItems');

        if (! empty($filters['search'])) {
            $query->where('name', 'like', '%'.$filters['search'].'%');
        }

        if (isset($filters['is_active']) && $filters['is_active'] !== '') {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        $paginator = $query->withCount('sizes')->orderBy('created_at', 'desc')->paginate($perPage);

        // Calculate orders_count for each product type
        $paginator->getCollection()->transform(function (ProductType $productType) {
            $productType->orders_count = $productType->sizes
                ->flatMap(fn ($size) => $size->orderItems->pluck('order_id'))
                ->unique()
                ->count();

            return $productType;
        });

        return $paginator;
    }

    /**
     * Get all product types with relationships and counts.
     */
    public function all(): Collection
    {
        return $this->query()
            ->with('sizes.orderItems')
            ->withCount('sizes')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (ProductType $productType) {
                $productType->orders_count = $productType->sizes
                    ->flatMap(fn ($size) => $size->orderItems->pluck('order_id'))
                    ->unique()
                    ->count();

                return $productType;
            });
    }

    /**
     * @return array<int, array{id: string, name: string, sizes: array}>
     */
    public function getAllForDropdown(): array
    {
        return $this->query()
            ->where('is_active', true)
            ->with(['sizes' => function ($query) {
                $query->where('is_active', true);
            }])
            ->orderBy('name')
            ->get()
            ->map(fn (ProductType $productType) => [
                'id' => $productType->id,
                'name' => $productType->name,
                'sizes' => $productType->sizes->map(fn ($size) => [
                    'id' => $size->id,
                    'size_label' => $size->size_label,
                    'product_type_id' => $size->product_type_id,
                ])->toArray(),
            ])
            ->toArray();
    }
}
