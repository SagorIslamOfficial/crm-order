<?php

namespace App\Modules\Shop\Contracts;

use App\Contracts\BaseServiceInterface;
use App\Modules\Shop\Models\Shop;
use Illuminate\Pagination\LengthAwarePaginator;

interface ShopServiceInterface extends BaseServiceInterface
{
    public function getPaginatedShops(?int $perPage = null, array $filters = []): LengthAwarePaginator;

    public function createShop(array $data): Shop;

    public function updateShop(Shop $shop, array $data): Shop;

    public function deleteShop(Shop $shop): bool;

    public function transformShopForResponse(Shop $shop): array;

    public function transformShopForList(Shop $shop): array;
}
