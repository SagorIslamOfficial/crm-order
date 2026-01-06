<?php

namespace App\Modules\Customer\Contracts;

use App\Contracts\BaseServiceInterface;
use App\Modules\Customer\Models\Customer;
use Illuminate\Pagination\LengthAwarePaginator;

interface CustomerServiceInterface extends BaseServiceInterface
{
    public function getPaginatedCustomers(array $filters = []): LengthAwarePaginator;

    public function getCustomerWithOrders(string $customerId): array;

    public function transformCustomerForResponse(Customer $customer): array;

    public function transformCustomerForList(Customer $customer): array;

    public function transformForLookup(Customer $customer): array;

    public function formatCustomerPhone(string $phone): string;

    public function formatCurrency(float $amount): string;

    public function formatDate(string $date): string;

    public function getByPhone(string $phone): ?Customer;

    public function createCustomer(array $data): Customer;

    public function updateCustomer(Customer $customer, array $data): Customer;
}
