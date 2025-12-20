<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductSizeController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UserController;
use App\Repositories\OrderRepository;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (OrderRepository $orderRepository) {
        return Inertia::render('dashboard', [
            'statistics' => $orderRepository->getStatistics(),
        ]);
    })->name('dashboard');

    // Orders management
    Route::get('orders', [OrderController::class, 'index'])->middleware('permission:orders.view')->name('orders.index');
    Route::get('orders/create', [OrderController::class, 'create'])->middleware('permission:orders.create')->name('orders.create');
    Route::post('orders', [OrderController::class, 'store'])->middleware('permission:orders.create')->name('orders.store');
    Route::get('orders/{order}', [OrderController::class, 'show'])->middleware('permission:orders.view')->name('orders.show');
    Route::get('orders/{order}/edit', [OrderController::class, 'edit'])->middleware('permission:orders.update')->name('orders.edit');
    Route::match(['put', 'patch'], 'orders/{order}', [OrderController::class, 'update'])->middleware('permission:orders.update')->name('orders.update');
    Route::delete('orders/{order}', [OrderController::class, 'destroy'])->middleware('permission:orders.delete')->name('orders.destroy');

    // Add payment to order
    Route::post('orders/{order}/payments', [PaymentController::class, 'store'])
        ->middleware('permission:payments.create')
        ->name('orders.payments.store');

    // Customer lookup by phone
    Route::get('api/customers/lookup', [CustomerController::class, 'lookup'])
        ->name('customers.lookup');

    // Customers management
    Route::get('customers', [CustomerController::class, 'index'])->middleware('permission:customers.view')->name('customers.index');
    Route::get('customers/create', [CustomerController::class, 'create'])->middleware('permission:customers.create')->name('customers.create');
    Route::post('customers', [CustomerController::class, 'store'])->middleware('permission:customers.create')->name('customers.store');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->middleware('permission:customers.view')->name('customers.show');
    Route::get('customers/{customer}/edit', [CustomerController::class, 'edit'])->middleware('permission:customers.update')->name('customers.edit');
    Route::match(['put', 'patch'], 'customers/{customer}', [CustomerController::class, 'update'])->middleware('permission:customers.update')->name('customers.update');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->middleware('permission:customers.delete')->name('customers.destroy');

    // Product Types management
    Route::get('product-types', [App\Http\Controllers\ProductTypeController::class, 'index'])->middleware('permission:product-types.view')->name('product-types.index');
    Route::get('product-types/create', [App\Http\Controllers\ProductTypeController::class, 'create'])->middleware('permission:product-types.create')->name('product-types.create');
    Route::post('product-types', [App\Http\Controllers\ProductTypeController::class, 'store'])->middleware('permission:product-types.create')->name('product-types.store');
    Route::get('product-types/{productType}', [App\Http\Controllers\ProductTypeController::class, 'show'])->middleware('permission:product-types.view')->name('product-types.show');
    Route::get('product-types/{productType}/edit', [App\Http\Controllers\ProductTypeController::class, 'edit'])->middleware('permission:product-types.update')->name('product-types.edit');
    Route::match(['put', 'patch'], 'product-types/{productType}', [App\Http\Controllers\ProductTypeController::class, 'update'])->middleware('permission:product-types.update')->name('product-types.update');
    Route::delete('product-types/{productType}', [App\Http\Controllers\ProductTypeController::class, 'destroy'])->middleware('permission:product-types.delete')->name('product-types.destroy');

    // Product Sizes management
    Route::get('product-sizes', [ProductSizeController::class, 'index'])->middleware('permission:product-sizes.view')->name('product-sizes.index');
    Route::get('product-sizes/create', [ProductSizeController::class, 'create'])->middleware('permission:product-sizes.create')->name('product-sizes.create');
    Route::post('product-sizes', [ProductSizeController::class, 'store'])->middleware('permission:product-sizes.create')->name('product-sizes.store');
    Route::get('product-sizes/{productSize}', [ProductSizeController::class, 'show'])->middleware('permission:product-sizes.view')->name('product-sizes.show');
    Route::get('product-sizes/{productSize}/edit', [ProductSizeController::class, 'edit'])->middleware('permission:product-sizes.update')->name('product-sizes.edit');
    Route::match(['put', 'patch'], 'product-sizes/{productSize}', [ProductSizeController::class, 'update'])->middleware('permission:product-sizes.update')->name('product-sizes.update');
    Route::delete('product-sizes/{productSize}', [ProductSizeController::class, 'destroy'])->middleware('permission:product-sizes.delete')->name('product-sizes.destroy');

    // Shops management
    Route::get('shops', [ShopController::class, 'index'])->middleware('permission:shops.view')->name('shops.index');
    Route::get('shops/create', [ShopController::class, 'create'])->middleware('permission:shops.create')->name('shops.create');
    Route::post('shops', [ShopController::class, 'store'])->middleware('permission:shops.create')->name('shops.store');
    Route::get('shops/{shop}', [ShopController::class, 'show'])->middleware('permission:shops.view')->name('shops.show');
    Route::get('shops/{shop}/edit', [ShopController::class, 'edit'])->middleware('permission:shops.update')->name('shops.edit');
    Route::match(['put', 'patch'], 'shops/{shop}', [ShopController::class, 'update'])->middleware('permission:shops.update')->name('shops.update');
    Route::delete('shops/{shop}', [ShopController::class, 'destroy'])->middleware('permission:shops.delete')->name('shops.destroy');

    // User Management
    Route::get('users', [UserController::class, 'index'])->middleware('permission:users.view')->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->middleware('permission:users.create')->name('users.create');
    Route::post('users', [UserController::class, 'store'])->middleware('permission:users.create')->name('users.store');
    Route::get('users/{user}', [UserController::class, 'show'])->middleware('permission:users.view')->name('users.show');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->middleware('permission:users.update')->name('users.edit');
    Route::match(['put', 'patch'], 'users/{user}', [UserController::class, 'update'])->middleware('permission:users.update')->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->middleware('permission:users.delete')->name('users.destroy');

    // Quick role assignment/removal for users
    Route::post('users/{user}/roles/{roleName}', [UserController::class, 'assignRole'])
        ->middleware('permission:users.update')
        ->name('users.roles.assign');
    Route::delete('users/{user}/roles/{roleName}', [UserController::class, 'removeRole'])
        ->middleware('permission:users.update')
        ->name('users.roles.remove');

    // Role Management
    Route::get('roles', [App\Http\Controllers\RoleController::class, 'index'])->middleware('permission:roles.view')->name('roles.index');
    Route::get('roles/create', [App\Http\Controllers\RoleController::class, 'create'])->middleware('permission:roles.create')->name('roles.create');
    Route::post('roles', [App\Http\Controllers\RoleController::class, 'store'])->middleware('permission:roles.create')->name('roles.store');
    Route::get('roles/{role}', [App\Http\Controllers\RoleController::class, 'show'])->middleware('permission:roles.view')->name('roles.show');
    Route::get('roles/{role}/edit', [App\Http\Controllers\RoleController::class, 'edit'])->middleware('permission:roles.update')->name('roles.edit');
    Route::match(['put', 'patch'], 'roles/{role}', [App\Http\Controllers\RoleController::class, 'update'])->middleware('permission:roles.update')->name('roles.update');
    Route::delete('roles/{role}', [App\Http\Controllers\RoleController::class, 'destroy'])->middleware('permission:roles.delete')->name('roles.destroy');

    // Permission Management
    Route::get('permissions', [App\Http\Controllers\PermissionController::class, 'index'])->middleware('permission:permissions.view')->name('permissions.index');
    Route::get('permissions/create', [App\Http\Controllers\PermissionController::class, 'create'])->middleware('permission:permissions.create')->name('permissions.create');
    Route::post('permissions', [App\Http\Controllers\PermissionController::class, 'store'])->middleware('permission:permissions.create')->name('permissions.store');
    Route::get('permissions/{permission}', [App\Http\Controllers\PermissionController::class, 'show'])->middleware('permission:permissions.view')->name('permissions.show');
    Route::get('permissions/{permission}/edit', [App\Http\Controllers\PermissionController::class, 'edit'])->middleware('permission:permissions.update')->name('permissions.edit');
    Route::match(['put', 'patch'], 'permissions/{permission}', [App\Http\Controllers\PermissionController::class, 'update'])->middleware('permission:permissions.update')->name('permissions.update');
    Route::delete('permissions/{permission}', [App\Http\Controllers\PermissionController::class, 'destroy'])->middleware('permission:permissions.delete')->name('permissions.destroy');
});

require __DIR__.'/settings.php';
