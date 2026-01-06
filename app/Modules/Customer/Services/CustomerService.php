<?php

namespace App\Modules\Customer\Services;

use App\Contracts\BaseRepositoryInterface;
use App\Modules\Customer\Contracts\CustomerRepositoryInterface;
use App\Modules\Customer\Contracts\CustomerServiceInterface;
use App\Modules\Customer\Models\Customer;
use App\Services\BaseService;
use Illuminate\Pagination\LengthAwarePaginator;

class CustomerService extends BaseService implements CustomerServiceInterface
{
    public function __construct(
        private CustomerRepositoryInterface $customerRepository,
    ) {}

    protected function repository(): BaseRepositoryInterface
    {
        return $this->customerRepository;
    }

    public function getPaginatedCustomers(array $filters = []): LengthAwarePaginator
    {
        return $this->customerRepository->getPaginatedWithFilters(null, $filters);
    }

    public function getCustomerWithOrders(string $customerId, int $perPage = 10): array
    {
        $customer = Customer::find($customerId);

        if (! $customer) {
            return [];
        }

        $orders = $customer->orders()
            ->latest()
            ->paginate($perPage);

        return $this->transformCustomerForResponse($customer, $orders);
    }

    public function transformCustomerForResponse(Customer $customer, $orders = null): array
    {
        $ordersData = [];

        if ($orders) {
            // If orders is a paginated result
            $ordersData = [
                'data' => collect($orders->items())->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'total_amount' => (string) $order->total_amount,
                        'status' => $order->status->value ?? $order->status,
                        'created_at' => $this->formatDate($order->created_at),
                    ];
                })->toArray(),
                'current_page' => $orders->currentPage(),
                'from' => $orders->firstItem(),
                'last_page' => $orders->lastPage(),
                'links' => $this->transformPaginationLinks($orders->getUrlRange(1, $orders->lastPage())),
                'next_page_url' => $orders->nextPageUrl(),
                'path' => $orders->path(),
                'per_page' => $orders->perPage(),
                'prev_page_url' => $orders->previousPageUrl(),
                'to' => $orders->lastItem(),
                'total' => $orders->total(),
            ];
        }

        return [
            'id' => $customer->id,
            'phone' => $this->formatCustomerPhone($customer->phone),
            'name' => $customer->name,
            'address' => $customer->address,
            'created_at' => $customer->created_at->format('Y-m-d'),
            'updated_at' => $customer->updated_at->format('Y-m-d'),
            'total_orders' => $orders?->total() ?? ($customer->orders_count ?? $customer->orders->count()),
            'orders' => $ordersData ?: [],
        ];
    }

    private function transformPaginationLinks(array $urls): array
    {
        $links = [];
        $currentPage = request()->input('page', 1);

        foreach ($urls as $page => $url) {
            $links[] = [
                'url' => $url,
                'label' => (string) $page,
                'active' => $page == $currentPage,
            ];
        }

        return $links;
    }

    public function transformCustomerForList(Customer $customer): array
    {
        return [
            'id' => $customer->id,
            'phone' => $this->formatCustomerPhone($customer->phone),
            'name' => $customer->name,
            'address' => $customer->address,
            'created_at' => $this->formatDate($customer->created_at),
        ];
    }

    public function transformForLookup(Customer $customer): array
    {
        return [
            'id' => $customer->id,
            'name' => $customer->name,
            'phone' => $customer->phone,
            'address' => $customer->address,
        ];
    }

    public function formatCustomerPhone(string $phone): string
    {
        if (strlen($phone) === 11 && str_starts_with($phone, '0')) {
            return substr($phone, 0, 5).'-'.substr($phone, 5);
        }

        return $phone;
    }

    public function formatCurrency(float $amount): string
    {
        return number_format($amount, 2);
    }

    public function formatDate(string $date): string
    {
        return date('M d, Y', strtotime($date));
    }

    public function getByPhone(string $phone): ?Customer
    {
        return $this->customerRepository->findByPhone($phone);
    }

    public function createCustomer(array $data): Customer
    {
        return $this->customerRepository->create($data);
    }

    public function updateCustomer(Customer $customer, array $data): Customer
    {
        return $this->customerRepository->update($customer, $data);
    }
}
