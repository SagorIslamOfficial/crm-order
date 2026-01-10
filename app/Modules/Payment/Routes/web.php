<?php

use App\Modules\Payment\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    // Add payment to order
    Route::post('orders/{order}/payments', [PaymentController::class, 'store'])
        ->middleware('permission:payments.create')
        ->name('orders.payments.store');
});
