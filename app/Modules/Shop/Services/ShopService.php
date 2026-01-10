<?php

namespace App\Modules\Shop\Services;

use App\Contracts\BaseRepositoryInterface;
use App\Modules\Shop\Contracts\ShopRepositoryInterface;
use App\Modules\Shop\Contracts\ShopServiceInterface;
use App\Modules\Shop\Models\Shop;
use App\Services\BaseService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ShopService extends BaseService implements ShopServiceInterface
{
    // Constructor.
    public function __construct(
        private ShopRepositoryInterface $shopRepository,
    ) {}

    // Get the repository.
    protected function repository(): BaseRepositoryInterface
    {
        return $this->shopRepository;
    }

    // Get paginated shops with optional filters.
    public function getPaginatedShops(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        $shops = $this->shopRepository->getPaginated($perPage, $filters);

        $shops->getCollection()->transform(function ($shop) {
            return $this->transformShopForList($shop);
        });

        return $shops;
    }

    // Create a new shop.
    public function createShop(array $data): Shop
    {
        return DB::transaction(function () use ($data) {
            return $this->shopRepository->create($data);
        });
    }

    // Update an existing shop.
    public function updateShop(Shop $shop, array $data): Shop
    {
        return DB::transaction(function () use ($shop, $data) {
            $this->shopRepository->update($shop, $data);

            return $shop->fresh();
        });
    }

    // Delete an existing shop.
    public function deleteShop(Shop $shop): bool
    {
        return $this->shopRepository->delete($shop);
    }

    // Transform a shop for response.
    public function transformShopForResponse(Shop $shop): array
    {
        $shop->loadCount('orders');

        return [
            'id' => $shop->id,
            'code' => $shop->code,
            'name' => $shop->name,
            'address' => $shop->address,
            'phone' => $shop->phone,
            'website' => $shop->website,
            'details' => $shop->details,
            'is_active' => $shop->is_active,
            'next_order_sequence' => $shop->next_order_sequence,
            'orders_count' => $shop->orders_count,
            'created_at' => $shop->created_at->toDateTimeString(),
            'updated_at' => $shop->updated_at->toDateTimeString(),
        ];
    }

    // Transform a shop for list.
    public function transformShopForList(Shop $shop): array
    {
        return [
            'id' => $shop->id,
            'code' => $shop->code,
            'name' => $shop->name,
            'address' => $shop->address,
            'phone' => $shop->phone,
            'website' => $shop->website,
            'is_active' => $shop->is_active,
            'orders_count' => $shop->orders_count ?? $shop->orders()->count(),
            'created_at' => $shop->created_at->toDateTimeString(),
        ];
    }
}
