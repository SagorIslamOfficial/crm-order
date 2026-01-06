import { usePermissions } from '@/hooks/usePermissions';
import React from 'react';

interface PermissionGuardProps {
    /**
     * Single permission or array of permissions to check
     */
    permission?: string | string[];

    /**
     * Single role or array of roles to check
     */
    role?: string | string[];

    /**
     * If true, user must have ALL specified permissions/roles
     * If false, user must have ANY of the specified permissions/roles
     * @default false
     */
    requireAll?: boolean;

    /**
     * Content to render if user doesn't have permission
     */
    fallback?: React.ReactNode;

    /**
     * Content to render if user has permission
     */
    children: React.ReactNode;
}

/**
 * Permission guard component for conditional rendering based on user permissions/roles
 *
 * @example
 * // Single permission
 * <PermissionGuard permission="users.delete">
 *   <Button variant="destructive">Delete</Button>
 * </PermissionGuard>
 *
 * @example
 * // Multiple permissions (any)
 * <PermissionGuard permission={["users.edit", "users.delete"]}>
 *   <ActionMenu />
 * </PermissionGuard>
 *
 * @example
 * // Multiple permissions (all required)
 * <PermissionGuard permission={["orders.create", "orders.edit"]} requireAll>
 *   <OrderForm />
 * </PermissionGuard>
 *
 * @example
 * // With fallback
 * <PermissionGuard
 *   permission="admin.view"
 *   fallback={<p>Access denied</p>}
 * >
 *   <AdminPanel />
 * </PermissionGuard>
 */
export function PermissionGuard({
    permission,
    role,
    requireAll = false,
    fallback = null,
    children,
}: PermissionGuardProps) {
    const {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        isAdmin,
    } = usePermissions();

    // Admin bypass
    if (isAdmin()) {
        return <>{children}</>;
    }

    let hasAccess = false;

    // Check permissions
    if (permission) {
        if (Array.isArray(permission)) {
            hasAccess = requireAll
                ? hasAllPermissions(permission)
                : hasAnyPermission(permission);
        } else {
            hasAccess = hasPermission(permission);
        }
    }

    // Check roles if no permission specified or if permission check failed
    if (!hasAccess && role) {
        if (Array.isArray(role)) {
            hasAccess = requireAll
                ? role.every((r) => hasRole(r))
                : hasAnyRole(role);
        } else {
            hasAccess = hasRole(role);
        }
    }

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
