<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Repositories\CustomerRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function __construct(
        private readonly CustomerRepository $customerRepository,
    ) {}

    public function index(Request $request)
    {
        $search = $request->query('search');
        $customers = $this->customerRepository->paginate(perPage: 15, search: $search);

        return Inertia::render('customers/index', [
            'customers' => $customers,
            'search' => $search,
        ]);
    }

    public function create()
    {
        return Inertia::render('customers/create');
    }

    public function store(StoreCustomerRequest $request)
    {
        $this->customerRepository->create($request->validated());

        return redirect()->route('customers.index')
            ->with('message', 'Customer created successfully.');
    }

    public function show(Customer $customer)
    {
        $customer->load(['orders.shop', 'orders.items', 'orders.payments']);

        return Inertia::render('customers/show', [
            'customer' => [
                'id' => $customer->id,
                'phone' => $customer->phone,
                'name' => $customer->name,
                'address' => $customer->address,
                'created_at' => $customer->created_at->format('Y-m-d'),
                'orders' => $customer->orders->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'amount' => $order->total_amount,
                        'status' => $order->status->value,
                        'created_at' => $order->created_at->format('Y-m-d'),
                    ];
                }),
            ],
        ]);
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('customers/edit', [
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
        $this->customerRepository->update($customer->id, $request->validated());

        return redirect()->route('customers.show', $customer)
            ->with('message', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $this->customerRepository->delete($customer->id);

        return redirect()->route('customers.index')
            ->with('message', 'Customer deleted successfully.');
    }

    public function lookup(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'size:11'],
        ]);

        $customer = $this->customerRepository->findByPhone($request->phone);

        if (! $customer) {
            return response()->json([
                'found' => false,
                'message' => 'Customer not found',
            ], 404);
        }

        return response()->json([
            'found' => true,
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'address' => $customer->address,
            ],
        ]);
    }
}
