import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePermissions } from '@/hooks/usePermissions';
import { dashboard } from '@/routes';
import { index as ordersIndex } from '@/routes/orders';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    Package,
    Ruler,
    Settings,
    Shield,
    ShoppingCart,
    Store,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { hasPermission, hasAnyRole, isAdmin, user } = usePermissions();

    // Build navigation items based on user permissions
    const mainNavItems: NavItem[] = [];

    // Always show dashboard for logged-in users
    if (user) {
        mainNavItems.push({
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        });
    }

    // Orders - show if user has permission or is admin
    if (hasPermission('orders.view') || isAdmin()) {
        mainNavItems.push({
            title: 'Orders',
            href: ordersIndex(),
            icon: ShoppingCart,
        });
    }

    // Customers
    if (
        hasPermission('customers.view') ||
        hasAnyRole(['Administrator', 'Salesperson'])
    ) {
        mainNavItems.push({
            title: 'Customers',
            href: '/customers',
            icon: Users,
        });
    }

    // Master Data Section - Product Types
    if (
        hasPermission('product-types.view') ||
        hasAnyRole(['Administrator', 'Product Manager'])
    ) {
        mainNavItems.push({
            title: 'Product Types',
            href: '/product-types',
            icon: Package,
        });
    }

    // Master Data Section - Product Sizes
    if (
        hasPermission('product-sizes.view') ||
        hasAnyRole(['Administrator', 'Product Manager'])
    ) {
        mainNavItems.push({
            title: 'Product Sizes',
            href: '/product-sizes',
            icon: Ruler,
        });
    }

    // Master Data Section - Shops
    if (
        hasPermission('shops.view') ||
        hasAnyRole(['Administrator', 'Quantity Manager'])
    ) {
        mainNavItems.push({
            title: 'Shops',
            href: '/shops',
            icon: Store,
        });
    }

    // User Management
    if (hasPermission('users.view') || isAdmin()) {
        mainNavItems.push({
            title: 'User Management',
            href: '/users',
            icon: Settings,
        });
    }

    // Role Management
    if (hasPermission('roles.view') || isAdmin()) {
        mainNavItems.push({
            title: 'Role Management',
            href: '/roles',
            icon: Users,
        });
    }

    // Permission Management
    if (hasPermission('permissions.view') || isAdmin()) {
        mainNavItems.push({
            title: 'Permission Management',
            href: '/permissions',
            icon: Shield,
        });
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
