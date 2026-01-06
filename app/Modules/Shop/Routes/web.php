<?php

use App\Modules\Shop\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    Route::get('shops', [ShopController::class, 'index'])
        ->middleware('permission:shops.view')
        ->name('shops.index');

    Route::get('shops/create', [ShopController::class, 'create'])
        ->middleware('permission:shops.create')
        ->name('shops.create');

    Route::post('shops', [ShopController::class, 'store'])
        ->middleware('permission:shops.create')
        ->name('shops.store');

    Route::get('shops/{shop}', [ShopController::class, 'show'])
        ->middleware('permission:shops.view')
        ->name('shops.show');

    Route::get('shops/{shop}/edit', [ShopController::class, 'edit'])
        ->middleware('permission:shops.update')
        ->name('shops.edit');

    Route::match(['put', 'patch'], 'shops/{shop}', [ShopController::class, 'update'])
        ->middleware('permission:shops.update')
        ->name('shops.update');

    Route::delete('shops/{shop}', [ShopController::class, 'destroy'])
        ->middleware('permission:shops.delete')
        ->name('shops.destroy');
});
