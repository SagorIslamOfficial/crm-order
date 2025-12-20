import { type User } from '@/types';

/**
 * Check if user has a specific permission
 */
export function hasPermission(
    user: User | null | undefined,
    permission: string,
): boolean {
    if (!user || !user.permissions) {
        return false;
    }

    return user.permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
    user: User | null | undefined,
    permissions: string[],
): boolean {
    if (!user || !user.permissions) {
        return false;
    }

    return permissions.some((permission) =>
        user.permissions!.includes(permission),
    );
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
    user: User | null | undefined,
    permissions: string[],
): boolean {
    if (!user || !user.permissions) {
        return false;
    }

    return permissions.every((permission) =>
        user.permissions!.includes(permission),
    );
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null | undefined, role: string): boolean {
    if (!user || !user.roles) {
        return false;
    }

    return user.roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(
    user: User | null | undefined,
    roles: string[],
): boolean {
    if (!user || !user.roles) {
        return false;
    }

    return roles.some((role) => user.roles!.includes(role));
}
