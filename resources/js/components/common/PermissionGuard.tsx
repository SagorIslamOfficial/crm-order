import { usePermissions } from '@/hooks/usePermissions';
import React from 'react';

interface PermissionGuardProps {
    permission?: string | string[];
    role?: string | string[];
    requireAll?: boolean;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

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
