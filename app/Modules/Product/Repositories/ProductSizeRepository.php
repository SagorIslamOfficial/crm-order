<?php

namespace App\Modules\Product\Repositories;

use App\Modules\Product\Contracts\ProductSizeRepositoryInterface;
use App\Modules\Product\Models\ProductSize;
use App\Repositories\BaseRepository;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<ProductSize>
 */
class ProductSizeRepository extends BaseRepository implements ProductSizeRepositoryInterface
{
    /**
     * Get the model class name.
     */
    protected function model(): string
    {
        return ProductSize::class;
    }

    /**
     * @return LengthAwarePaginator<ProductSize>
     */
    public function getPaginated(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        $perPage = $this->getPerPage($perPage);

        $query = $this->query()->with('productType');

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('productType', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if (! empty($filters['product_type_id'])) {
            $query->where('product_type_id', $filters['product_type_id']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * @return array<int, array{id: string, name: string}>
     */
    public function getByProductType(string $productTypeId): array
    {
        return $this->query()
            ->where('product_type_id', $productTypeId)
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->toArray();
    }
}
