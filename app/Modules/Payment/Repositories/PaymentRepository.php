<?php

namespace App\Modules\Payment\Repositories;

use App\Modules\Payment\Contracts\PaymentRepositoryInterface;
use App\Modules\Payment\Models\Payment;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class PaymentRepository extends BaseRepository implements PaymentRepositoryInterface
{
    protected function model(): string
    {
        return Payment::class;
    }

    public function findByOrder(string $orderId): Collection
    {
        return Payment::query()
            ->where('order_id', $orderId)
            ->orderBy('paid_at', 'desc')
            ->get();
    }

    public function create(array $data): Model
    {
        return Payment::create($data);
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

    public function getTotalPaidForOrder(string $orderId): float
    {
        return (float) Payment::query()
            ->where('order_id', $orderId)
            ->sum('amount');
    }
}
