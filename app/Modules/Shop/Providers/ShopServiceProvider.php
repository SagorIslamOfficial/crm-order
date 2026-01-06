<?php

namespace App\Modules\Shop\Providers;

use App\Modules\Shop\Contracts\ShopRepositoryInterface;
use App\Modules\Shop\Contracts\ShopServiceInterface;
use App\Modules\Shop\Models\Shop;
use App\Modules\Shop\Policies\ShopPolicy;
use App\Modules\Shop\Repositories\ShopRepository;
use App\Modules\Shop\Services\ShopService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class ShopServiceProvider extends ServiceProvider
{
    // Register bindings in the container.
    public function register(): void
    {
        $this->app->bind(ShopRepositoryInterface::class, ShopRepository::class);
        $this->app->bind(ShopServiceInterface::class, ShopService::class);
    }

    // Bootstrap services.
    public function boot(): void
    {
        Gate::policy(Shop::class, ShopPolicy::class);

        $this->loadRoutesFrom(__DIR__.'/../Routes/web.php');
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');
    }
}
