<?php

namespace App\Modules\Product\Providers;

use App\Modules\Product\Contracts\ProductServiceInterface;
use App\Modules\Product\Contracts\ProductSizeRepositoryInterface;
use App\Modules\Product\Contracts\ProductTypeRepositoryInterface;
use App\Modules\Product\Models\ProductSize;
use App\Modules\Product\Models\ProductType;
use App\Modules\Product\Policies\ProductSizePolicy;
use App\Modules\Product\Policies\ProductTypePolicy;
use App\Modules\Product\Repositories\ProductSizeRepository;
use App\Modules\Product\Repositories\ProductTypeRepository;
use App\Modules\Product\Services\ProductService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class ProductServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProductTypeRepositoryInterface::class, ProductTypeRepository::class);
        $this->app->bind(ProductSizeRepositoryInterface::class, ProductSizeRepository::class);
        $this->app->bind(ProductServiceInterface::class, ProductService::class);
    }

    public function boot(): void
    {
        Gate::policy(ProductType::class, ProductTypePolicy::class);
        Gate::policy(ProductSize::class, ProductSizePolicy::class);

        $this->loadRoutesFrom(__DIR__.'/../Routes/web.php');
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');
    }
}
