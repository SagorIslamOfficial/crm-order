<?php

namespace App\Providers\Modules;

use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    // Register services.
    public function register(): void
    {
        $providers = $this->findServiceProviders();

        foreach ($providers as $providerClass) {
            if (class_exists($providerClass)) {
                $this->app->register($providerClass);
            }
        }
    }

    // Bootstrap services.
    public function boot(): void
    {
        //
    }

    // Find all module service providers.
    private function findServiceProviders(): array
    {
        // Path to the Modules directory
        $modulesPath = app_path('Modules');
        $providers = [];

        // Check if the Modules directory exists
        if (! File::exists($modulesPath)) {
            return $providers;
        }

        // Get all files in the Modules directory and its subdirectories
        $files = File::allFiles($modulesPath);

        // Filter and collect service provider classes
        foreach ($files as $file) {
            if (str_ends_with($file->getFilename(), 'ServiceProvider.php')) {
                $relativePath = str_replace(app_path().'/', '', $file->getPathname());
                $namespace = 'App\\'.str_replace(['/', '.php'], ['\\', ''], $relativePath);

                $providers[] = $namespace;
            }
        }

        // Return the list of service provider classes
        return $providers;
    }
}
