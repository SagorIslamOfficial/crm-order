<?php

namespace App\Modules\Order\Repositories;

use App\Modules\Order\Contracts\OrderRepositoryInterface;
use App\Modules\Order\Models\Order;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    protected function model(): string
    {
        return Order::class;
    }

    public function all(): Collection
    {
        return Order::query()
            ->with(['shop', 'customer', 'items', 'payments'])
            ->latest()
            ->get();
    }

    public function getPaginated(?int $perPage = null, array $filters = []): LengthAwarePaginator
    {
        $perPage = $this->getPerPage($perPage);

        $query = Order::query()
            ->with(['shop', 'customer'])
            ->latest();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    })
                    ->orWhereHas('shop', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%");
                    });
            });
        }

        return $query->paginate($perPage);
    }

    public function find(string $id): ?Model
    {
        return Order::query()
            ->with(['shop', 'customer', 'items.productType', 'items.productSize', 'payments'])
            ->find($id);
    }

    public function create(array $data): Model
    {
        return Order::create($data);
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
}
