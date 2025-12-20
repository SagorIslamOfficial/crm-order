<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Repositories\ProductTypeRepository;
use App\Repositories\ShopRepository;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private OrderRepository $orderRepository,
        private OrderService $orderService,
        private ShopRepository $shopRepository,
        private ProductTypeRepository $productTypeRepository,
    ) {}

    /**
     * Display a listing of orders.
     */
    public function index(): Response
    {
        $orders = $this->orderRepository->paginate(15);

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show the form for creating a new order.
     */
    public function create(): Response
    {
        $shops = $this->shopRepository->allActive();
        $productTypes = $this->productTypeRepository->allActiveWithSizes();

        return Inertia::render('orders/create', [
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
    public function show(Order $order): Response
    {
        $order = $this->orderRepository->findById($order->id);

        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }

    /**
     * Show the form for editing the specified order.
     */
    public function edit(Order $order): Response
    {
        $order = $this->orderRepository->findById($order->id);
        $shops = $this->shopRepository->allActive();
        $productTypes = $this->productTypeRepository->allActiveWithSizes();

        return Inertia::render('orders/edit', [
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
