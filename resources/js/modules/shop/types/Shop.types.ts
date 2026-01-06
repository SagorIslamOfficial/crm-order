export interface Shop {
    id: string;
    code: string;
    name: string;
    address: string;
    phone: string;
    website?: string;
    location?: string;
    details?: string;
    is_active: boolean;
    next_order_sequence: number;
    orders_count?: number;
    created_at: string;
    updated_at: string;
}

export interface ShopFilters {
    search?: string;
    page?: number;
    is_active?: boolean;
}

export interface ShopForm {
    code: string;
    name: string;
    address: string;
    phone: string;
    website?: string;
    location?: string;
    details?: string;
    is_active: boolean;
    next_order_sequence: number;
}

export interface ShopLookupRequest {
    search?: string;
}

export interface ShopLookupResponse {
    data: Shop[];
}
