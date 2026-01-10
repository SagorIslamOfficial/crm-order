import type { PageProps } from '@/types';

export interface Order {
    id: string;
    order_number: string;
    shop_id: string;
    customer_id: string;
    delivery_date: string;
    delivery_address: string;
    total_amount: string;
    advance_paid: string;
    discount_amount: string;
    discount_type: 'percentage' | 'fixed';
    due_amount: string;
    status: 'pending' | 'delivered' | 'cancelled';
    created_at: string;
    updated_at: string;
    shop: {
        id: string;
        name: string;
        code: string;
        address: string;
        phone: string;
    };
    customer: {
        id: string;
        name: string;
        phone: string;
        address: string | null;
    };
    items: OrderItem[];
    payments: Payment[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_type_id: string;
    product_size_id: string;
    quantity: number;
    price: string;
    notes?: string;
    line_total: string;
    product_type: {
        id: string;
        name: string;
    };
    product_size: {
        id: string;
        name: string;
        size_label: string;
    };
}

export interface Payment {
    id: string;
    order_id: string;
    amount: string;
    paid_at: string;
    method: string;
    transaction_id: string | null;
    bank_name: string | null;
    account_number: string | null;
    mfs_provider: string | null;
    mfs_number: string | null;
}

export interface OrderForm {
    shop_id: string;
    customer_id: string;
    delivery_date: string;
    delivery_address: string;
    discount_amount: string;
    discount_type: 'percentage' | 'fixed';
    items: OrderItemForm[];
}

export interface OrderItemForm {
    product_type_id: string;
    product_size_id: string;
    quantity: number;
    price: string;
    notes?: string;
}

export interface OrderFilters {
    search?: string;
    status?: 'pending' | 'delivered' | 'cancelled';
    shop_id?: string;
    date_from?: string;
    date_to?: string;
}

export interface OrderSummary {
    total_orders: number;
    pending_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    total_revenue: string;
    pending_revenue: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface OrderIndexResponse {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export interface OrderIndexProps extends PageProps {
    orders: OrderIndexResponse;
}

export interface Shop {
    id: string;
    name: string;
    code: string;
}

export interface ProductSize {
    id: string;
    size_label: string;
    product_type_id: string;
    cost?: number;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ProductType {
    id: string;
    name: string;
    sizes: ProductSize[];
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface OrderItemFormData {
    product_type_id: string;
    product_size_id: string;
    quantity: number;
    price: number;
    notes?: string;
}

export interface CreateOrderPageProps extends PageProps {
    shops: Shop[];
    productTypes: ProductType[];
}

export interface EditOrderPageProps extends PageProps {
    order: Order;
    shops: Shop[];
    productTypes: ProductType[];
}
