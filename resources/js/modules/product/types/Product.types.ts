export interface ProductType {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    sizes?: ProductSize[];
    sizes_count?: number;
}

export interface ProductSize {
    id: string;
    product_type_id: string;
    size_label: string;
    price: string;
    description: string | null;
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
    price: string;
    description?: string;
    is_active: boolean;
}

export interface ProductTypeFilters {
    search?: string;
    is_active?: boolean;
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
