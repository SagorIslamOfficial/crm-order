<?php

namespace App\Repositories;

use App\Models\Shop;
use Illuminate\Database\Eloquent\Collection;

class ShopRepository
{
    public function all(): Collection
    {
        return Shop::query()->get();
    }

    public function allActive(): Collection
    {
        return Shop::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function findById(string $id): ?Shop
    {
        return Shop::find($id);
    }

    public function findByCode(string $code): ?Shop
    {
        return Shop::query()
            ->where('code', $code)
            ->first();
    }

    public function create(array $data): Shop
    {
        return Shop::create($data);
    }

    public function update(Shop $shop, array $data): bool
    {
        return $shop->update($data);
    }

    public function delete(Shop $shop): bool
    {
        return $shop->delete();
    }

    public function lockForOrderNumber(string $shopId): Shop
    {
        return Shop::query()
            ->where('id', $shopId)
            ->lockForUpdate()
            ->firstOrFail();
    }

    public function incrementOrderSequence(Shop $shop): void
    {
        $shop->increment('next_order_sequence');
    }
}
