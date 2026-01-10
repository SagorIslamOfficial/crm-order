<?php

namespace App\Modules\Shop\Repositories;

use App\Modules\Shop\Contracts\ShopRepositoryInterface;
use App\Modules\Shop\Models\Shop;
use App\Repositories\BaseRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ShopRepository extends BaseRepository implements ShopRepositoryInterface
{
    // Get the model class name.
    protected function model(): string
    {
        return Shop::class;
    }

    // Get paginated shops with optional filters.
    public function getPaginated(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        $perPage = $this->getPerPage($perPage);

        $query = $this->query();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage)->withQueryString();
    }

    // Get all shops for dropdown.
    public function getAllForDropdown(): array
    {
        return $this->query()
            ->select('id', 'code', 'name')
            ->orderBy('name')
            ->get()
            ->toArray();
    }

    // Lock a shop for order number generation.
    public function lockForOrderNumber(string $shopId): Shop
    {
        return $this->query()
            ->where('id', $shopId)
            ->lockForUpdate()
            ->first();
    }

    // Increment the shop's next order sequence.
    public function incrementOrderSequence(Shop $shop): void
    {
        $shop->increment('next_order_sequence');
    }
}
