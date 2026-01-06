<?php

namespace App\Modules\Dashboard\Services;

use App\Modules\Dashboard\Contracts\DashboardServiceInterface;
use App\Modules\Order\Contracts\OrderRepositoryInterface;

class DashboardService implements DashboardServiceInterface
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
    ) {}

    /**
     * Get dashboard statistics.
     *
     * @return array<string, mixed>
     */
    public function getStatistics(): array
    {
        $allOrders = $this->orderRepository->all();

        $pendingOrders = $allOrders->where('status', 'pending')->count();
        $deliveredOrders = $allOrders->where('status', 'delivered')->count();
        $cancelledOrders = $allOrders->where('status', 'cancelled')->count();

        $totalRevenue = $allOrders->sum('total_amount');
        $totalPaid = $allOrders->sum('advance_paid');
        $totalDue = $allOrders->sum('due_amount');

        return [
            'total_orders' => $allOrders->count(),
            'pending_orders' => $pendingOrders,
            'delivered_orders' => $deliveredOrders,
            'cancelled_orders' => $cancelledOrders,
            'total_revenue' => $totalRevenue,
            'total_paid' => $totalPaid,
            'total_due' => $totalDue,
        ];
    }
}
