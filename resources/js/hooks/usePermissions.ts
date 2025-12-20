import { usePage } from '@inertiajs/react';

interface AuthUser {
    id: string;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
}

interface PagePropsWithAuth {
    auth?: {
        user?: AuthUser;
    };
    [key: string]: unknown;
}

/**
 * Custom hook for checking user permissions
 * Provides easy-to-use methods for permission-based conditional rendering
 */
export function usePermissions() {
    const pageProps = usePage().props as PagePropsWithAuth;
    const auth = pageProps.auth;
    const user = auth?.user;

    /**
     * Check if user has a specific permission
     */
    const hasPermission = (permission: string): boolean => {
        if (!user?.permissions) return false;
        return user.permissions.includes(permission);
    };

    /**
     * Check if user has any of the specified permissions
     */
    const hasAnyPermission = (permissions: string[]): boolean => {
        if (!user?.permissions) return false;
        return permissions.some((permission) =>
            user.permissions.includes(permission),
        );
    };

    /**
     * Check if user has all of the specified permissions
     */
    const hasAllPermissions = (permissions: string[]): boolean => {
        if (!user?.permissions) return false;
        return permissions.every((permission) =>
            user.permissions.includes(permission),
        );
    };

    /**
     * Check if user has a specific role
     */
    const hasRole = (role: string): boolean => {
        if (!user?.roles) return false;
        return user.roles.includes(role);
    };

    /**
     * Check if user has any of the specified roles
     */
    const hasAnyRole = (roles: string[]): boolean => {
        if (!user?.roles) return false;
        return roles.some((role) => user.roles.includes(role));
    };

    /**
     * Check if user is an administrator (has admin role or all permissions)
     */
    const isAdmin = (): boolean => {
        return (
            hasRole('Administrator') ||
            hasAllPermissions([
                'users.view',
                'users.create',
                'users.update',
                'users.delete',
                'roles.view',
                'roles.create',
                'roles.update',
                'roles.delete',
                'permissions.view',
                'permissions.create',
                'permissions.update',
                'permissions.delete',
            ])
        );
    };

    return {
        user,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        isAdmin,
        permissions: user?.permissions || [],
        roles: user?.roles || [],
    };
}
