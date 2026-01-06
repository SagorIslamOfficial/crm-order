<?php

namespace App\Modules\Payment\Contracts;

use App\Contracts\BaseServiceInterface;
use App\Modules\Payment\Models\Payment;

/**
 * @extends BaseServiceInterface<Payment>
 */
interface PaymentServiceInterface extends BaseServiceInterface
{
    /**
     * Get total amount paid for an order.
     */
    public function getTotalPaidForOrder(string $orderId): float;
}
