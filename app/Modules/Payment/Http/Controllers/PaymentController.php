<?php

namespace App\Modules\Payment\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Contracts\OrderServiceInterface;
use App\Modules\Order\Models\Order;
use App\Modules\Payment\Http\Requests\StorePaymentRequest;
use Illuminate\Http\RedirectResponse;

class PaymentController extends Controller
{
    public function __construct(
        private OrderServiceInterface $orderService,
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
