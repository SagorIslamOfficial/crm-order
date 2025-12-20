<?php

namespace App\Repositories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderRepository
{
    public function all(): Collection
    {
        return Order::query()
            ->with(['shop', 'customer', 'items', 'payments'])
            ->latest()
            ->get();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Order::query()
            ->with(['shop', 'customer'])
            ->latest()
            ->paginate($perPage);
    }

    public function findById(string $id): ?Order
    {
        return Order::query()
            ->with(['shop', 'customer', 'items.productType', 'items.productSize', 'payments'])
            ->find($id);
    }

    public function findByOrderNumber(string $orderNumber): ?Order
    {
        return Order::query()
            ->with(['shop', 'customer', 'items.productType', 'items.productSize', 'payments'])
            ->where('order_number', $orderNumber)
            ->first();
    }

    public function findByShop(string $shopId): Collection
    {
        return Order::query()
            ->where('shop_id', $shopId)
            ->with(['customer', 'items'])
            ->latest()
            ->get();
    }

    public function findByCustomer(string $customerId): Collection
    {
        return Order::query()
            ->where('customer_id', $customerId)
            ->with(['shop', 'items'])
            ->latest()
            ->get();
    }

    public function create(array $data): Order
    {
        return Order::create($data);
    }

    public function update(Order $order, array $data): bool
    {
        return $order->update($data);
    }

    public function delete(Order $order): bool
    {
        return $order->delete();
    }

    public function getStatistics(): array
    {
        $orders = Order::query();

        return [
            'total_orders' => $orders->count(),
            'pending_orders' => (clone $orders)->where('status', 'pending')->count(),
            'delivered_orders' => (clone $orders)->where('status', 'delivered')->count(),
            'cancelled_orders' => (clone $orders)->where('status', 'cancelled')->count(),
            'total_revenue' => (clone $orders)->sum('total_amount'),
            'total_paid' => (clone $orders)->sum('advance_paid'),
            'total_due' => (clone $orders)->sum('due_amount'),
        ];
    }
}
