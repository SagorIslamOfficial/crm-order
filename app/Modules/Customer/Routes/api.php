<?php

use App\Modules\Customer\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;

Route::get('customers/lookup', [CustomerController::class, 'lookup'])
    ->name('customers.lookup');
