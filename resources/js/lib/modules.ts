import { dashboard } from '@/routes';
import { index as customersIndex } from '@/routes/customers';
import { index as ordersIndex } from '@/routes/orders';
import { index as permissionsIndex } from '@/routes/permissions';
import { index as productSizesIndex } from '@/routes/product-sizes';
import { index as productTypesIndex } from '@/routes/product-types';
import { index as rolesIndex } from '@/routes/roles';
import { index as shopsIndex } from '@/routes/shops';
import { index as usersIndex } from '@/routes/users';
import type { LucideIcon } from 'lucide-react';
import {
    LayoutGrid,
    Package,
    Ruler,
    Shield,
    ShoppingCart,
    Store,
    Users,
} from 'lucide-react';

export interface ModuleItem {
    id: string;
    title: string;
    icon: LucideIcon;
    group: string;
    order: number;
    route: () => { url: string; method: string };
    permission?: string | string[] | null;
    isExternal?: boolean;
}

const modules: ModuleItem[] = [
    // ===== PLATFORM GROUP =====
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: LayoutGrid,
        group: 'Platform',
        order: 10,
        route: () => dashboard(),
        permission: null,
    },

    // ===== SALES GROUP =====
    {
        id: 'orders',
        title: 'Orders',
        icon: ShoppingCart,
        group: 'Sales',
        order: 20,
        route: () => ordersIndex(),
        permission: 'orders.view',
    },
    {
        id: 'customers',
        title: 'Customers',
        icon: Users,
        group: 'Sales',
        order: 21,
        route: () => customersIndex(),
        permission: 'customers.view',
    },

    // ===== CATALOG GROUP =====
    {
        id: 'product-types',
        title: 'Product Types',
        icon: Package,
        group: 'Catalog',
        order: 30,
        route: () => productTypesIndex(),
        permission: 'product-types.view',
    },
    {
        id: 'product-sizes',
        title: 'Product Sizes',
        icon: Ruler,
        group: 'Catalog',
        order: 31,
        route: () => productSizesIndex(),
        permission: 'product-sizes.view',
    },
    {
        id: 'shops',
        title: 'Shops',
        icon: Store,
        group: 'Catalog',
        order: 32,
        route: () => shopsIndex(),
        permission: 'shops.view',
    },

    // ===== ADMINISTRATION GROUP =====
    {
        id: 'users',
        title: 'User Management',
        icon: Users,
        group: 'Administration',
        order: 40,
        route: () => usersIndex(),
        permission: 'users.view',
    },
    {
        id: 'roles',
        title: 'Role Management',
        icon: Users,
        group: 'Administration',
        order: 41,
        route: () => rolesIndex(),
        permission: 'roles.view',
    },
    {
        id: 'permissions',
        title: 'Permission Management',
        icon: Shield,
        group: 'Administration',
        order: 42,
        route: () => permissionsIndex(),
        permission: 'permissions.view',
    },
];

export default modules;
