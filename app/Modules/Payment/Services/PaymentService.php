<?php

namespace App\Modules\Payment\Services;

use App\Contracts\BaseRepositoryInterface;
use App\Modules\Payment\Contracts\PaymentRepositoryInterface;
use App\Modules\Payment\Contracts\PaymentServiceInterface;
use App\Services\BaseService;

class PaymentService extends BaseService implements PaymentServiceInterface
{
    public function __construct(
        private PaymentRepositoryInterface $paymentRepository,
    ) {}

    protected function repository(): BaseRepositoryInterface
    {
        return $this->paymentRepository;
    }

    /**
     * Get total amount paid for an order.
     */
    public function getTotalPaidForOrder(string $orderId): float
    {
        return $this->paymentRepository->getTotalPaidForOrder($orderId);
    }
}
