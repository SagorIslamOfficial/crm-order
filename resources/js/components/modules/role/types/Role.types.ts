import type { PageProps } from '@/types';
import { Filters } from '@/types';

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: string[];
    users_count: number;
    created_at: string;
    updated_at: string;
}

export interface RoleForm {
    name: string;
    guard_name: string;
    permissions: string[];
}

export interface RoleFilters extends Filters {
    search?: string;
    guard_name?: string;
}

export interface Permission {
    name: string;
    label: string;
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
export interface RoleIndexProps extends PageProps {
    roles: {
        data: Role[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    search?: string;
}

export interface CreateRolePageProps extends PageProps {
    permissions: Permission[];
}

export interface EditRolePageProps extends PageProps {
    role: Role;
    permissions: Permission[];
}

export interface ShowRolePageProps extends PageProps {
    role: Role & {
        users: User[];
    };
}
