<?php

use App\Modules\Product\Http\Controllers\ProductSizeController;
use Illuminate\Support\Facades\Route;

// Product Sizes API
Route::get('product-sizes/by-type', [ProductSizeController::class, 'byType'])
    ->name('product-sizes.by-type');
