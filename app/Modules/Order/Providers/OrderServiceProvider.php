<?php

namespace App\Modules\Order\Providers;

use App\Modules\Order\Contracts\OrderItemRepositoryInterface;
use App\Modules\Order\Contracts\OrderRepositoryInterface;
use App\Modules\Order\Contracts\OrderServiceInterface;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Policies\OrderPolicy;
use App\Modules\Order\Repositories\OrderItemRepository;
use App\Modules\Order\Repositories\OrderRepository;
use App\Modules\Order\Services\OrderService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class OrderServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind repository interfaces
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
        $this->app->bind(OrderItemRepositoryInterface::class, OrderItemRepository::class);

        // Bind service interfaces
        $this->app->bind(OrderServiceInterface::class, OrderService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Register policies
        Gate::policy(Order::class, OrderPolicy::class);

        // Load module routes
        $this->loadRoutesFrom(__DIR__.'/../Routes/web.php');

        // Load module migrations
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');

        // Load module config
        $this->mergeConfigFrom(__DIR__.'/../Config/order.php', 'order');

        // Publish config
        $this->publishes([
            __DIR__.'/../Config/order.php' => config_path('order.php'),
        ], 'order-config');
    }
}
