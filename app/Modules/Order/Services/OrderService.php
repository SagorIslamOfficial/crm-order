<?php

namespace App\Modules\Order\Services;

use App\Modules\Customer\Repositories\CustomerRepository;
use App\Modules\Order\Contracts\OrderItemRepositoryInterface;
use App\Modules\Order\Contracts\OrderRepositoryInterface;
use App\Modules\Order\Contracts\OrderServiceInterface;
use App\Modules\Order\Models\Order;
use App\Modules\Payment\Contracts\PaymentRepositoryInterface;
use App\Modules\Shop\Models\Shop;
use App\Modules\Shop\Repositories\ShopRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class OrderService implements OrderServiceInterface
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private OrderItemRepositoryInterface $orderItemRepository,
        private PaymentRepositoryInterface $paymentRepository,
        private CustomerRepository $customerRepository,
        private ShopRepository $shopRepository,
    ) {}

    public function getPaginatedOrders(array $filters = []): LengthAwarePaginator
    {
        return $this->orderRepository->getPaginated(null, $filters);
    }

    /**
     * Create a new order with items and optional initial payment.
     *
     * @throws \Throwable
     */
    public function create(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            // Find or create customer by phone
            $customer = $this->customerRepository->firstOrCreate(
                ['phone' => $data['customer']['phone']],
                [
                    'name' => $data['customer']['name'],
                    'address' => $data['customer']['address'] ?? null,
                ]
            );

            // Generate order number with shop lock
            $shop = $this->shopRepository->lockForOrderNumber($data['shop_id']);
            $orderNumber = $this->generateOrderNumber($shop);

            // Calculate totals
            $itemsTotal = $this->calculateItemsTotal($data['items']);
            $discountAmount = $this->calculateDiscount(
                $itemsTotal,
                $data['discount_amount'] ?? 0,
                $data['discount_type'] ?? 'fixed'
            );
            $totalAmount = $itemsTotal - $discountAmount;

            // Create order
            $order = $this->orderRepository->create([
                'order_number' => $orderNumber,
                'shop_id' => $data['shop_id'],
                'customer_id' => $customer->id,
                'delivery_date' => $data['delivery_date'],
                'delivery_address' => $data['delivery_address'] ?? null,
                'total_amount' => $totalAmount,
                'discount_amount' => $discountAmount,
                'discount_type' => $data['discount_type'] ?? 'fixed',
                'advance_paid' => 0,
                'due_amount' => $totalAmount,
                'status' => 'pending',
            ]);

            // Create order items
            foreach ($data['items'] as $item) {
                $lineTotal = $item['quantity'] * $item['price'];
                $this->orderItemRepository->create([
                    'order_id' => $order->id,
                    'product_type_id' => $item['product_type_id'],
                    'product_size_id' => $item['product_size_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'notes' => $item['notes'] ?? null,
                    'line_total' => $lineTotal,
                ]);
            }

            // Create initial payment if provided
            if (! empty($data['payment'])) {
                $this->paymentRepository->create([
                    'order_id' => $order->id,
                    'method' => $data['payment']['method'],
                    'amount' => $data['payment']['amount'],
                    'transaction_id' => $data['payment']['transaction_id'] ?? null,
                    'bank_name' => $data['payment']['bank_name'] ?? null,
                    'account_number' => $data['payment']['account_number'] ?? null,
                    'mfs_provider' => $data['payment']['mfs_provider'] ?? null,
                    'mfs_number' => $data['payment']['mfs_number'] ?? null,
                    'paid_at' => $data['payment']['paid_at'] ?? now(),
                ]);

                // Update advance_paid and due_amount
                $this->updateOrderTotals($order);
            }

            // Increment shop order sequence
            $this->shopRepository->incrementOrderSequence($shop);

            return $order->load(['shop', 'customer', 'items.productType', 'items.productSize', 'payments']);
        });
    }

    /**
     * Update an existing order.
     *
     * @throws \Throwable
     */
    public function update(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data) {
            // Handle order cancellation - create refund for paid amount
            if (isset($data['status']) && $data['status'] === 'cancelled' && $order->status !== 'cancelled') {
                if ($order->advance_paid > 0) {
                    $this->paymentRepository->create([
                        'order_id' => $order->id,
                        'method' => 'refund',
                        'amount' => -$order->advance_paid,
                        'transaction_id' => null,
                        'paid_at' => now(),
                    ]);
                }
            }

            // Update customer if phone changed
            if (isset($data['customer']['phone']) && $data['customer']['phone'] !== $order->customer->phone) {
                $customer = $this->customerRepository->firstOrCreate(
                    ['phone' => $data['customer']['phone']],
                    [
                        'name' => $data['customer']['name'],
                        'address' => $data['customer']['address'] ?? null,
                    ]
                );
                $data['customer_id'] = $customer->id;
            }

            // Update order items if provided
            if (isset($data['items'])) {
                $this->orderItemRepository->deleteByOrder($order->id);

                foreach ($data['items'] as $item) {
                    $lineTotal = $item['quantity'] * $item['price'];
                    $this->orderItemRepository->create([
                        'order_id' => $order->id,
                        'product_type_id' => $item['product_type_id'],
                        'product_size_id' => $item['product_size_id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                        'notes' => $item['notes'] ?? null,
                        'line_total' => $lineTotal,
                    ]);
                }

                // Recalculate totals
                $itemsTotal = $this->calculateItemsTotal($data['items']);
                $discountAmount = $this->calculateDiscount(
                    $itemsTotal,
                    $data['discount_amount'] ?? $order->discount_amount,
                    $data['discount_type'] ?? $order->discount_type->value
                );
                $totalAmount = $itemsTotal - $discountAmount;

                $data['total_amount'] = $totalAmount;
                $data['discount_amount'] = $discountAmount;
            }

            // Update order
            $this->orderRepository->update($order, $data);

            // Recalculate advance_paid and due_amount from payments
            $this->updateOrderTotals($order);

            return $order->fresh(['shop', 'customer', 'items.productType', 'items.productSize', 'payments']);
        });
    }

    /**
     * Add a payment to an order.
     *
     * @throws \Throwable
     */
    public function addPayment(Order $order, array $paymentData): Order
    {
        return DB::transaction(function () use ($order, $paymentData) {
            $this->paymentRepository->create([
                'order_id' => $order->id,
                'method' => $paymentData['method'],
                'amount' => $paymentData['amount'],
                'transaction_id' => $paymentData['transaction_id'] ?? null,
                'bank_name' => $paymentData['bank_name'] ?? null,
                'account_number' => $paymentData['account_number'] ?? null,
                'mfs_provider' => $paymentData['mfs_provider'] ?? null,
                'mfs_number' => $paymentData['mfs_number'] ?? null,
                'paid_at' => $paymentData['paid_at'] ?? now(),
            ]);

            $this->updateOrderTotals($order);

            return $order->fresh(['shop', 'customer', 'items', 'payments']);
        });
    }

    /**
     * Recalculate order totals based on current items and payments.
     */
    public function recalculateTotals(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            // Calculate items total
            $itemsTotal = $this->calculateItemsTotal($order->items->toArray());

            // Calculate discount
            $discountAmount = $this->calculateDiscount(
                $itemsTotal,
                (float) ($order->discount_amount ?? 0),
                $order->discount_type->value
            );

            $totalAmount = $itemsTotal - $discountAmount;

            // Update order totals
            $this->orderRepository->update($order, [
                'total_amount' => $totalAmount,
                'discount_amount' => $discountAmount,
            ]);

            // Update payment totals
            $this->updateOrderTotals($order);

            return $order->fresh(['shop', 'customer', 'items', 'payments']);
        });
    }

    /**
     * Generate unique order number for a shop.
     */
    private function generateOrderNumber(Shop $shop): string
    {
        return 'ORD-'.$shop->code.'-'.str_pad((string) $shop->next_order_sequence, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Calculate total from order items.
     *
     * @param  array<array<string, mixed>>  $items
     */
    private function calculateItemsTotal(array $items): float
    {
        return array_reduce($items, function ($total, $item) {
            return $total + ($item['quantity'] * $item['price']);
        }, 0);
    }

    /**
     * Calculate discount amount based on type.
     */
    private function calculateDiscount(float $subtotal, float $discountAmount, string $discountType): float
    {
        if ($discountType === 'percentage') {
            return ($subtotal * $discountAmount) / 100;
        }

        return $discountAmount;
    }

    /**
     * Update order advance_paid and due_amount from payments.
     */
    private function updateOrderTotals(Order $order): void
    {
        $totalPaid = $this->paymentRepository->getTotalPaidForOrder($order->id);
        $dueAmount = $order->total_amount - $totalPaid;

        $this->orderRepository->update($order, [
            'advance_paid' => $totalPaid,
            'due_amount' => max(0, $dueAmount),
        ]);
    }
}
