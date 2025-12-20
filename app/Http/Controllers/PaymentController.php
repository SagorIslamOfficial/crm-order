<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;

class PaymentController extends Controller
{
    public function __construct(
        private OrderService $orderService,
    ) {}

    /**
     * Store a new payment for an order.
     */
    public function store(StorePaymentRequest $request, Order $order): RedirectResponse
    {
        $this->orderService->addPayment($order, $request->validated());

        return redirect()->route('orders.show', $order)
            ->with('success', 'Payment added successfully.');
    }
}
