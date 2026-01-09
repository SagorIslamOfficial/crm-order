import type { PageProps } from '@/types';

export interface ProductType {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    sizes?: ProductSize[];
    sizes_count?: number;
    orders_count?: number;
}

export interface ProductSize {
    id: string;
    product_type_id: string;
    size_label: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    product_type?: ProductType;
}

export interface ProductTypeForm {
    name: string;
    description?: string;
    is_active: boolean;
}

export interface ProductSizeForm {
    product_type_id: string;
    size_label: string;
    is_active: boolean;
}

export interface ProductTypeFilters {
    search?: string;
    is_active?: boolean;
    date_from?: string;
    date_to?: string;
}

export interface ProductSizeFilters {
    search?: string;
    product_type_id?: string;
    is_active?: boolean;
    page?: number;
}

export interface ProductSizeByTypeResponse {
    data: ProductSize[];
}

export interface ProductTypeIndexProps extends PageProps {
    productTypes: {
        data: ProductType[];
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

export interface ProductTypeShowProps extends PageProps {
    productType: ProductType;
}

export interface ProductSizeIndexProps extends PageProps {
    productSizes: {
        data: ProductSize[];
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

export interface ProductSizeShowProps extends PageProps {
    productSize: ProductSize;
}
