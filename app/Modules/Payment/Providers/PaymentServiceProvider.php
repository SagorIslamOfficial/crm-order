<?php

namespace App\Modules\Payment\Providers;

use App\Modules\Payment\Contracts\PaymentRepositoryInterface;
use App\Modules\Payment\Contracts\PaymentServiceInterface;
use App\Modules\Payment\Repositories\PaymentRepository;
use App\Modules\Payment\Services\PaymentService;
use Illuminate\Support\ServiceProvider;

class PaymentServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind repository interfaces
        $this->app->bind(PaymentRepositoryInterface::class, PaymentRepository::class);

        // Bind service interfaces
        $this->app->bind(PaymentServiceInterface::class, PaymentService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Load module migrations
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');
    }
}
