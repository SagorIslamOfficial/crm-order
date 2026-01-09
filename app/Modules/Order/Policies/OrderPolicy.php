<?php

namespace App\Modules\Order\Policies;

use App\Models\User;
use App\Modules\Order\Models\Order;

/**
 * @mixin \Spatie\Permission\Traits\HasRoles
 */
class OrderPolicy
{
    /**
     * Determine if the user can view any orders.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('orders.view');
    }

    /**
     * Determine if the user can view an order.
     */
    public function view(User $user, Order $order): bool
    {
        return $user->hasPermissionTo('orders.view');
    }

    /**
     * Determine if the user can create orders.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('orders.create');
    }

    /**
     * Determine if the user can update an order.
     */
    public function update(User $user, Order $order): bool
    {
        return $user->hasPermissionTo('orders.update');
    }

    /**
     * Determine if the user can delete an order.
     */
    public function delete(User $user, Order $order): bool
    {
        return $user->hasPermissionTo('orders.delete');
    }

    /**
     * Determine if the user can permanently delete an order.
     */
    public function forceDelete(User $user, Order $order): bool
    {
        return $user->hasPermissionTo('orders.delete');
    }
}
