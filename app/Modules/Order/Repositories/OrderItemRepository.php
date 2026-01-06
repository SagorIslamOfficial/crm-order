<?php

namespace App\Modules\Order\Repositories;

use App\Modules\Order\Contracts\OrderItemRepositoryInterface;
use App\Modules\Order\Models\OrderItem;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class OrderItemRepository extends BaseRepository implements OrderItemRepositoryInterface
{
    protected function model(): string
    {
        return OrderItem::class;
    }

    public function findByOrder(string $orderId): Collection
    {
        return OrderItem::query()
            ->where('order_id', $orderId)
            ->with(['productType', 'productSize'])
            ->get();
    }

    public function create(array $data): Model
    {
        return OrderItem::create($data);
    }

    public function update(Model $model, array $data): Model
    {
        $model->update($data);

        return $model->fresh();
    }

    public function delete(Model $model): bool
    {
        return $model->delete();
    }

    public function deleteByOrder(string $orderId): int
    {
        return OrderItem::query()
            ->where('order_id', $orderId)
            ->delete();
    }
}
