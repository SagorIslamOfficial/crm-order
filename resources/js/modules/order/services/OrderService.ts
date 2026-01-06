import type { Order, OrderFilters, OrderForm } from '../types';

export class OrderService {
    static async getOrders(filters: OrderFilters = {}): Promise<{
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    }> {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.shop_id) params.append('shop_id', filters.shop_id);
        if (filters.date_from) params.append('date_from', filters.date_from);
        if (filters.date_to) params.append('date_to', filters.date_to);

        const response = await fetch(`/api/orders?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        return response.json();
    }

    static async getOrder(id: string): Promise<Order> {
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch order');
        }
        return response.json();
    }

    static async createOrder(data: OrderForm): Promise<Order> {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        return response.json();
    }

    static async updateOrder(
        id: string,
        data: Partial<OrderForm>,
    ): Promise<Order> {
        const response = await fetch(`/api/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update order');
        }

        return response.json();
    }

    static async deleteOrder(id: string): Promise<void> {
        const response = await fetch(`/api/orders/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete order');
        }
    }

    static getStatusColor(status: Order['status']): string {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    }

    static getStatusLabel(status: Order['status']): string {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'delivered':
                return 'Delivered';
            case 'cancelled':
                return 'Cancelled';
            default:
                return 'Unknown';
        }
    }

    static formatCurrency(amount: string | number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Number(amount));
    }

    static formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }
}
