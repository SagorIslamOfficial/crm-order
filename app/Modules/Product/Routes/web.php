<?php

use App\Modules\Product\Http\Controllers\ProductSizeController;
use App\Modules\Product\Http\Controllers\ProductTypeController;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    // Product Types
    Route::get('product-types', [ProductTypeController::class, 'index'])
        ->middleware('permission:product-types.view')
        ->name('product-types.index');

    Route::get('product-types/create', [ProductTypeController::class, 'create'])
        ->middleware('permission:product-types.create')
        ->name('product-types.create');

    Route::post('product-types', [ProductTypeController::class, 'store'])
        ->middleware('permission:product-types.create')
        ->name('product-types.store');

    Route::get('product-types/{product_type}', [ProductTypeController::class, 'show'])
        ->middleware('permission:product-types.view')
        ->name('product-types.show');

    Route::get('product-types/{product_type}/edit', [ProductTypeController::class, 'edit'])
        ->middleware('permission:product-types.update')
        ->name('product-types.edit');

    Route::match(['put', 'patch'], 'product-types/{product_type}', [ProductTypeController::class, 'update'])
        ->middleware('permission:product-types.update')
        ->name('product-types.update');

    Route::delete('product-types/{product_type}', [ProductTypeController::class, 'destroy'])
        ->middleware('permission:product-types.delete')
        ->name('product-types.destroy');

    // Product Sizes
    Route::get('api/product-sizes/by-type', [ProductSizeController::class, 'byType'])
        ->name('product-sizes.by-type');

    Route::get('product-sizes', [ProductSizeController::class, 'index'])
        ->middleware('permission:product-sizes.view')
        ->name('product-sizes.index');

    Route::get('product-sizes/create', [ProductSizeController::class, 'create'])
        ->middleware('permission:product-sizes.create')
        ->name('product-sizes.create');

    Route::post('product-sizes', [ProductSizeController::class, 'store'])
        ->middleware('permission:product-sizes.create')
        ->name('product-sizes.store');

    Route::get('product-sizes/{product_size}', [ProductSizeController::class, 'show'])
        ->middleware('permission:product-sizes.view')
        ->name('product-sizes.show');

    Route::get('product-sizes/{product_size}/edit', [ProductSizeController::class, 'edit'])
        ->middleware('permission:product-sizes.update')
        ->name('product-sizes.edit');

    Route::match(['put', 'patch'], 'product-sizes/{product_size}', [ProductSizeController::class, 'update'])
        ->middleware('permission:product-sizes.update')
        ->name('product-sizes.update');

    Route::delete('product-sizes/{product_size}', [ProductSizeController::class, 'destroy'])
        ->middleware('permission:product-sizes.delete')
        ->name('product-sizes.destroy');
});
