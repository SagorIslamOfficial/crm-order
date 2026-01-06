<?php

namespace App\Modules\Order\Contracts;

use App\Contracts\BaseRepositoryInterface;
use App\Modules\Order\Models\OrderItem;
use Illuminate\Database\Eloquent\Collection;

/**
 * @extends BaseRepositoryInterface<OrderItem>
 */
interface OrderItemRepositoryInterface extends BaseRepositoryInterface
{
    public function findByOrder(string $orderId): Collection;

    public function deleteByOrder(string $orderId): int;
}
