<?php

namespace App\Modules\Order\Contracts;

use App\Modules\Order\Models\Order;
use Illuminate\Pagination\LengthAwarePaginator;

interface OrderServiceInterface
{
    /**
     * Get paginated orders with optional filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getPaginatedOrders(array $filters = []): LengthAwarePaginator;

    /**
     * Create a new order with items and optional initial payment.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws \Throwable
     */
    public function create(array $data): Order;

    /**
     * Update an existing order.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws \Throwable
     */
    public function update(Order $order, array $data): Order;

    /**
     * Add a payment to an order.
     *
     * @param  array<string, mixed>  $paymentData
     *
     * @throws \Throwable
     */
    public function addPayment(Order $order, array $paymentData): Order;

    /**
     * Recalculate order totals based on current items and payments.
     */
    public function recalculateTotals(Order $order): Order;
}
