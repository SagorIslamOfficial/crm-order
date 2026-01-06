<?php

namespace App\Modules\Customer\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Customer\Contracts\CustomerServiceInterface;
use App\Modules\Customer\Http\Requests\StoreCustomerRequest;
use App\Modules\Customer\Http\Requests\UpdateCustomerRequest;
use App\Modules\Customer\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(
        private readonly CustomerServiceInterface $customerService,
    ) {}

    public function index(Request $request): Response|JsonResponse
    {
        $filters = $request->only(['search', 'date_from', 'date_to']);
        $customers = $this->customerService->getPaginatedCustomers($filters);

        if ($request->wantsJson()) {
            return response()->json($customers);
        }

        return Inertia::render('modules/customer/index', [
            'customers' => $customers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('modules/customer/create');
    }

    public function store(StoreCustomerRequest $request)
    {
        $customer = $this->customerService->createCustomer($request->validated());

        return redirect()->route('customers.show', $customer)
            ->with('message', 'Customer created successfully.');
    }

    public function show(Customer $customer): Response|JsonResponse
    {
        $customerData = $this->customerService->getCustomerWithOrders($customer->id);

        if (request()->wantsJson()) {
            return response()->json($customerData);
        }

        return Inertia::render('modules/customer/show', [
            'customer' => $customerData,
        ]);
    }

    public function edit(Customer $customer): Response
    {
        return Inertia::render('modules/customer/edit', [
            'customer' => [
                'id' => $customer->id,
                'phone' => $customer->phone,
                'name' => $customer->name,
                'address' => $customer->address,
            ],
        ]);
    }

    public function update(Customer $customer, UpdateCustomerRequest $request)
    {
        $customer = $this->customerService->updateCustomer($customer, $request->validated());

        return redirect()->route('customers.show', $customer)
            ->with('message', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $this->customerService->delete($customer);

        return redirect()->route('customers.index')
            ->with('message', 'Customer deleted successfully.');
    }

    public function lookup(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'size:11'],
        ]);

        $customer = $this->customerService->getByPhone($request->phone);

        if (! $customer) {
            return response()->json([
                'found' => false,
                'message' => 'Customer not found',
            ], 404);
        }

        return response()->json([
            'found' => true,
            'customer' => $this->customerService->transformForLookup($customer),
        ]);
    }
}
