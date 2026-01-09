import type { PageProps } from '@/types';
import { Filters } from '@/types';

export interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
    updated_at: string;
    email_verified_at: string | null;
}

export interface UserForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    roles: string[];
}

export interface UserFilters extends Filters {
    search?: string;
    role?: string;
    verified?: boolean;
}

export interface Role {
    name: string;
    label: string;
    permissions_count?: number;
    permissions?: string[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Page Props
export interface UserIndexProps extends PageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    search?: string;
    roles: string[];
}

export interface CreateUserPageProps extends PageProps {
    roles: Role[];
}

export interface EditUserPageProps extends PageProps {
    user: User;
    roles: Role[];
}

export interface ShowUserPageProps extends PageProps {
    user: User;
    available_roles: Role[];
}
