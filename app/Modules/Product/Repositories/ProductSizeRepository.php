<?php

namespace App\Modules\Product\Repositories;

use App\Modules\Product\Contracts\ProductSizeRepositoryInterface;
use App\Modules\Product\Models\ProductSize;
use App\Repositories\BaseRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductSizeRepository extends BaseRepository implements ProductSizeRepositoryInterface
{
    // Model
    protected function model(): string
    {
        return ProductSize::class;
    }

    // Get paginated
    public function getPaginated(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        $perPage = $this->getPerPage($perPage);

        $query = $this->query()->with('productType');

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('size_label', 'like', "%{$search}%")
                    ->orWhereHas('productType', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if (! empty($filters['product_type_id'])) {
            $query->where('product_type_id', $filters['product_type_id']);
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

        return $query->orderBy('created_at', 'desc')->paginate($perPage)->withQueryString();
    }

    // Get by product type
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
