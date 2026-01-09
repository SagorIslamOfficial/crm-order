<?php

namespace App\Modules\Customer\Policies;

use App\Models\User;
use App\Modules\Customer\Models\Customer;

/**
 * @mixin \Spatie\Permission\Traits\HasRoles
 */
class CustomerPolicy
{
    /**
     * Determine if the user can view any customers.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('customers.view');
    }

    /**
     * Determine if the user can view a customer.
     */
    public function view(User $user, Customer $customer): bool
    {
        return $user->hasPermissionTo('customers.view');
    }

    /**
     * Determine if the user can create customers.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('customers.create');
    }

    /**
     * Determine if the user can update a customer.
     */
    public function update(User $user, Customer $customer): bool
    {
        return $user->hasPermissionTo('customers.update');
    }

    /**
     * Determine if the user can delete a customer.
     */
    public function delete(User $user, Customer $customer): bool
    {
        return $user->hasPermissionTo('customers.delete');
    }

    /**
     * Determine if the user can permanently delete a customer.
     */
    public function forceDelete(User $user, Customer $customer): bool
    {
        return $user->hasPermissionTo('customers.delete');
    }
}
