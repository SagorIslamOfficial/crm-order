<?php

namespace App\Repositories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Collection;

class PaymentRepository
{
    public function findByOrder(string $orderId): Collection
    {
        return Payment::query()
            ->where('order_id', $orderId)
            ->orderBy('paid_at', 'desc')
            ->get();
    }

    public function create(array $data): Payment
    {
        return Payment::create($data);
    }

    public function update(Payment $payment, array $data): bool
    {
        return $payment->update($data);
    }

    public function delete(Payment $payment): bool
    {
        return $payment->delete();
    }

    public function getTotalPaidForOrder(string $orderId): float
    {
        return (float) Payment::query()
            ->where('order_id', $orderId)
            ->sum('amount');
    }
}
