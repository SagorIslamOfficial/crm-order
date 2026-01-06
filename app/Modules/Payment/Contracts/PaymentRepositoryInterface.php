<?php

namespace App\Modules\Payment\Contracts;

use App\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

interface PaymentRepositoryInterface extends BaseRepositoryInterface
{
    public function findByOrder(string $orderId): Collection;

    public function getTotalPaidForOrder(string $orderId): float;
}
