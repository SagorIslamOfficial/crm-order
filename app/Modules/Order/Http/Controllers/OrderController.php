<?php

namespace App\Modules\Order\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Customer\Repositories\CustomerRepository;
use App\Modules\Order\Contracts\OrderRepositoryInterface;
use App\Modules\Order\Contracts\OrderServiceInterface;
use App\Modules\Order\Http\Requests\StoreOrderRequest;
use App\Modules\Order\Http\Requests\UpdateOrderRequest;
use App\Modules\Order\Models\Order;
use App\Modules\Product\Repositories\ProductTypeRepository;
use App\Modules\Shop\Repositories\ShopRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private OrderServiceInterface $orderService,
        private ShopRepository $shopRepository,
        private ProductTypeRepository $productTypeRepository,
        private CustomerRepository $customerRepository,
    ) {}

    /**
     * Display a listing of orders.
     */
    public function index(): Response|JsonResponse
    {
        $filters = request()->only(['search']);
        $orders = $this->orderService->getPaginatedOrders($filters);

        if (request()->wantsJson()) {
            return response()->json($orders);
        }

        return Inertia::render('modules/order/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show the form for creating a new order.
     */
    public function create(): Response
    {
        $shops = $this->shopRepository->getAllForDropdown();
        $productTypes = $this->productTypeRepository->getAllForDropdown();

        return Inertia::render('modules/order/create', [
            'shops' => $shops,
            'productTypes' => $productTypes,
        ]);
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $order = $this->orderService->create($request->validated());

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order created successfully.');
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): Response|JsonResponse
    {
        $order = $this->orderRepository->find($order->id);

        if (request()->wantsJson()) {
            return response()->json($order);
        }

        return Inertia::render('modules/order/show', [
            'order' => $order,
        ]);
    }

    /**
     * Show the form for editing the specified order.
     */
    public function edit(Order $order): Response
    {
        $order = $this->orderRepository->find($order->id);
        $shops = $this->shopRepository->getAllForDropdown();
        $productTypes = $this->productTypeRepository->getAllForDropdown();

        return Inertia::render('modules/order/edit', [
            'order' => $order,
            'shops' => $shops,
            'productTypes' => $productTypes,
        ]);
    }

    /**
     * Update the specified order in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order): RedirectResponse
    {
        $this->orderService->update($order, $request->validated());

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(Order $order): RedirectResponse
    {
        $order->delete();

        return redirect()->route('orders.index')
            ->with('success', 'Order deleted successfully.');
    }
}
