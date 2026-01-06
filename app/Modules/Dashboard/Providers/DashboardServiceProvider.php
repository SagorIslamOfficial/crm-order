<?php

namespace App\Modules\Dashboard\Providers;

use App\Modules\Dashboard\Contracts\DashboardServiceInterface;
use App\Modules\Dashboard\Services\DashboardService;
use Illuminate\Support\ServiceProvider;

class DashboardServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(
            DashboardServiceInterface::class,
            DashboardService::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../Routes/web.php');
    }
}
