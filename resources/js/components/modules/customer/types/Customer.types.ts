import type { PageProps } from '@/types';
import { BaseEntity, Filters } from '@/types';

export interface Customer extends BaseEntity {
    phone: string;
    name: string;
    address: string | null;
    orders?: PaginatedOrders;
    created_at: string;
    updated_at: string;
}

export interface CustomerForm {
    phone: string;
    name: string;
    address?: string;
}

export interface CustomerFilters extends Filters {
    search?: string;
    date_from?: string;
    date_to?: string;
}

export interface OrderSummary {
    id: string;
    order_number: string;
    total_amount: string;
    status: string;
    created_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedOrders {
    data: OrderSummary[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface CustomerLookupRequest {
    phone: string;
}

export interface CustomerLookupResponse {
    found: boolean;
    customer?: {
        id: string;
        name: string;
        phone: string;
        address: string | null;
    };
    message?: string;
}

// Page Props
export interface CustomerIndexProps extends PageProps {
    customers: {
        data: Customer[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}
export type CreateCustomerPageProps = PageProps;

export interface EditCustomerPageProps extends PageProps {
    customer: Customer;
}
