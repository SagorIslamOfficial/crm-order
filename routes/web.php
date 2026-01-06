<?php

use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::prefix('dashboard')->group(function () {
        require __DIR__.'/../app/Modules/Dashboard/Routes/web.php';
    });

    // Customer
    Route::prefix('')->group(function () {
        require __DIR__.'/../app/Modules/Customer/Routes/web.php';
    });

    // Order
    Route::prefix('')->group(function () {
        require __DIR__.'/../app/Modules/Order/Routes/web.php';
    });

    // Payment
    Route::prefix('')->group(function () {
        require __DIR__.'/../app/Modules/Payment/Routes/web.php';
    });

    // Product
    Route::prefix('')->group(function () {
        require __DIR__.'/../app/Modules/Product/Routes/web.php';
    });

    // Shop
    Route::prefix('')->group(function () {
        require __DIR__.'/../app/Modules/Shop/Routes/web.php';
    });

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
    Route::get('roles', [RoleController::class, 'index'])->middleware('permission:roles.view')->name('roles.index');
    Route::get('roles/create', [RoleController::class, 'create'])->middleware('permission:roles.create')->name('roles.create');
    Route::post('roles', [RoleController::class, 'store'])->middleware('permission:roles.create')->name('roles.store');
    Route::get('roles/{role}', [RoleController::class, 'show'])->middleware('permission:roles.view')->name('roles.show');
    Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->middleware('permission:roles.update')->name('roles.edit');
    Route::match(['put', 'patch'], 'roles/{role}', [RoleController::class, 'update'])->middleware('permission:roles.update')->name('roles.update');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->middleware('permission:roles.delete')->name('roles.destroy');

    // Permission Management
    Route::get('permissions', [PermissionController::class, 'index'])->middleware('permission:permissions.view')->name('permissions.index');
    Route::get('permissions/create', [PermissionController::class, 'create'])->middleware('permission:permissions.create')->name('permissions.create');
    Route::post('permissions', [PermissionController::class, 'store'])->middleware('permission:permissions.create')->name('permissions.store');
    Route::get('permissions/{permission}', [PermissionController::class, 'show'])->middleware('permission:permissions.view')->name('permissions.show');
    Route::get('permissions/{permission}/edit', [PermissionController::class, 'edit'])->middleware('permission:permissions.update')->name('permissions.edit');
    Route::match(['put', 'patch'], 'permissions/{permission}', [PermissionController::class, 'update'])->middleware('permission:permissions.update')->name('permissions.update');
    Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->middleware('permission:permissions.delete')->name('permissions.destroy');
});

require __DIR__.'/settings.php';
