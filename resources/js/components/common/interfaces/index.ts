/**
 * Common interfaces used across the CRM application
 */

export interface Note {
    id: string;
    title?: string;
    content: string;
    created_at: string;
    updated_at: string;
    created_by?: {
        id: string;
        name: string;
    };
}

export interface Document {
    id: string;
    title: string;
    file_name: string;
    file_path: string;
    file_url?: string;
    file_size?: number;
    file_type?: string;
    description?: string;
    uploaded_at: string;
    uploaded_by?: {
        id: string;
        name: string;
    };
}

export interface Address {
    street?: string;
    city: string;
    state?: string;
    postal_code?: string;
    country: string;
}

export interface Contact {
    id: string;
    name: string;
    email?: string;
    phone: string;
    position?: string;
    is_primary?: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    links: unknown[];
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
}
