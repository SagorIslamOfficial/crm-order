<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Delete existing roles and permissions to avoid conflicts
        Role::query()->delete();
        Permission::query()->delete();

        // Create permissions
        $permissions = [
            // Dashboard
            'dashboard.view',

            // Order permissions
            'orders.view',
            'orders.create',
            'orders.update',
            'orders.delete',
            'orders.print-customer-copy',
            'orders.print-office-copy',
            'orders.print-tailor-copy',

            // Customer permissions
            'customers.view',
            'customers.create',
            'customers.update',
            'customers.delete',

            // Payment permissions
            'payments.view',
            'payments.create',
            'payments.update',
            'payments.delete',

            // Master data permissions
            'shops.view',
            'shops.create',
            'shops.update',
            'shops.delete',
            'product-types.view',
            'product-types.create',
            'product-types.update',
            'product-types.delete',
            'product-sizes.view',
            'product-sizes.create',
            'product-sizes.update',
            'product-sizes.delete',

            // User management
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'roles.view',
            'roles.create',
            'roles.update',
            'roles.delete',

            // Permission management
            'permissions.view',
            'permissions.create',
            'permissions.update',
            'permissions.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'Administrator']);
        $adminRole->givePermissionTo($permissions); // All permissions

        $salespersonRole = Role::create(['name' => 'Salesperson']);
        $salespersonRole->givePermissionTo([
            'dashboard.view',
            'orders.view',
            'orders.create',
            'orders.update',
            'orders.print-customer-copy',
            'orders.print-office-copy',
            'customers.view',
            'customers.create',
            'customers.update',
            'payments.view',
            'payments.create',
        ]);

        $productManagerRole = Role::create(['name' => 'Product Manager']);
        $productManagerRole->givePermissionTo([
            'dashboard.view',
            'product-types.view',
            'product-types.create',
            'product-types.update',
            'product-types.delete',
            'product-sizes.view',
            'product-sizes.create',
            'product-sizes.update',
            'product-sizes.delete',
            'orders.view',
        ]);

        $quantityManagerRole = \Spatie\Permission\Models\Role::create(['name' => 'Quantity Manager']);
        $quantityManagerRole->givePermissionTo([
            'dashboard.view',
            'orders.view',
            'orders.update',
            'shops.view',
            'shops.create',
            'shops.update',
            'shops.delete',
        ]);

        $productionRole = Role::create(['name' => 'Production Manager']);
        $productionRole->givePermissionTo([
            'dashboard.view',
            'orders.view',
            'orders.update',
            'orders.print-tailor-copy',
        ]);

        $qcRole = Role::create(['name' => 'Quality Controller']);
        $qcRole->givePermissionTo([
            'dashboard.view',
            'orders.view',
            'orders.update',
            'orders.print-tailor-copy',
        ]);
    }
}
