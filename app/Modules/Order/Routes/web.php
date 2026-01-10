<?php

use App\Modules\Order\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    // Orders management
    Route::get('orders', [OrderController::class, 'index'])
        ->middleware('permission:orders.view')
        ->name('orders.index');

    Route::get('orders/create', [OrderController::class, 'create'])
        ->middleware('permission:orders.create')
        ->name('orders.create');

    Route::post('orders', [OrderController::class, 'store'])
        ->middleware('permission:orders.create')
        ->name('orders.store');

    Route::get('orders/{order}', [OrderController::class, 'show'])
        ->middleware('permission:orders.view')
        ->name('orders.show');

    Route::get('orders/{order}/edit', [OrderController::class, 'edit'])
        ->middleware('permission:orders.update')
        ->name('orders.edit');

    Route::match(['put', 'patch'], 'orders/{order}', [OrderController::class, 'update'])
        ->middleware('permission:orders.update')
        ->name('orders.update');

    Route::delete('orders/{order}', [OrderController::class, 'destroy'])
        ->middleware('permission:orders.delete')
        ->name('orders.destroy');
});
