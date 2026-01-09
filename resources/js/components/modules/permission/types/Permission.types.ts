import type { PageProps } from '@/types';
import { Filters } from '@/types';

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    roles_count: number;
    users_count: number;
    created_at: string;
    updated_at: string;
}

export interface PermissionForm {
    name: string;
    guard_name: string;
}

export interface PermissionFilters extends Filters {
    search?: string;
    guard_name?: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Page Props
export interface PermissionIndexProps extends PageProps {
    permissions: {
        data: Permission[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: PaginationLink[];
    };
    search?: string;
}

export type CreatePermissionPageProps = PageProps;

export interface EditPermissionPageProps extends PageProps {
    permission: Permission;
}

export interface ShowPermissionPageProps extends PageProps {
    permission: Permission;
    roles: Role[];
    users: User[];
}
