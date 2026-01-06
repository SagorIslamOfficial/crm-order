<?php

namespace App\Modules\Order\Policies;

use App\Models\User;
use App\Modules\Order\Models\Order;

class OrderPolicy
{
    /**
     * Determine whether the user can view any orders.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('orders.view');
    }

    /**
     * Determine whether the user can view the order.
     */
    public function view(User $user, Order $order): bool
    {
        return $user->hasPermissionTo('orders.view');
    }

    /**
     * Determine whether the user can create orders.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('orders.create');
    }

    /**
     * Determine whether the user can update the order.
     */
    public function update(User $user, Order $order): bool
    {
        return $user->hasPermissionTo('orders.update');
    }

    /**
     * Determine whether the user can delete the order.
     */
    public function delete(User $user, Order $order): bool
    {
        return $user->hasPermissionTo('orders.delete');
    }
}
