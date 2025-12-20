<?php

namespace App\Repositories;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Collection;

class OrderItemRepository
{
    public function findByOrder(string $orderId): Collection
    {
        return OrderItem::query()
            ->where('order_id', $orderId)
            ->with(['productType', 'productSize'])
            ->get();
    }

    public function create(array $data): OrderItem
    {
        return OrderItem::create($data);
    }

    public function createMany(array $items): Collection
    {
        $orderItems = collect();

        foreach ($items as $itemData) {
            $orderItems->push($this->create($itemData));
        }

        return $orderItems;
    }

    public function update(OrderItem $orderItem, array $data): bool
    {
        return $orderItem->update($data);
    }

    public function delete(OrderItem $orderItem): bool
    {
        return $orderItem->delete();
    }

    public function deleteByOrder(string $orderId): int
    {
        return OrderItem::query()
            ->where('order_id', $orderId)
            ->delete();
    }
}
