import type {
    Customer,
    CustomerFilters,
    CustomerForm,
    CustomerLookupRequest,
    CustomerLookupResponse,
} from '../types';

export class CustomerService {
    static async getCustomers(filters: CustomerFilters = {}): Promise<{
        data: Customer[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    }> {
        const params = new URLSearchParams();

        if (filters.search) {
            params.append('search', filters.search);
        }
        if (filters.date_from) {
            params.append('date_from', filters.date_from);
        }
        if (filters.date_to) {
            params.append('date_to', filters.date_to);
        }

        const response = await fetch(`/api/customers?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        return response.json();
    }

    static async getCustomer(id: string): Promise<Customer> {
        const response = await fetch(`/api/customers/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch customer');
        }
        return response.json();
    }

    static async createCustomer(data: CustomerForm): Promise<Customer> {
        const response = await fetch('/api/customers', {
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
            throw new Error('Failed to create customer');
        }

        return response.json();
    }

    static async updateCustomer(
        id: string,
        data: CustomerForm,
    ): Promise<Customer> {
        const response = await fetch(`/api/customers/${id}`, {
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
            throw new Error('Failed to update customer');
        }

        return response.json();
    }

    static async deleteCustomer(id: string): Promise<void> {
        const response = await fetch(`/api/customers/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete customer');
        }
    }

    static async lookupCustomer(
        data: CustomerLookupRequest,
    ): Promise<CustomerLookupResponse> {
        const params = new URLSearchParams();
        params.append('phone', data.phone);

        const response = await fetch(
            `/api/customers/lookup?${params.toString()}`,
        );
        if (!response.ok && response.status !== 404) {
            throw new Error('Failed to lookup customer');
        }

        return response.json();
    }

    static formatCurrency(amount: string | number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(Number(amount));
    }

    static formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    static formatPhone(phone: string): string {
        if (phone.length === 11 && phone.startsWith('0')) {
            return `${phone.slice(0, 5)}-${phone.slice(5)}`;
        }
        return phone;
    }
}
