import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { OrderService } from '../services';
import type { OrderForm } from '../types';

const initialFormData: OrderForm = {
    shop_id: '',
    customer_id: '',
    delivery_date: '',
    delivery_address: '',
    discount_amount: '0',
    discount_type: 'fixed',
    items: [],
};

export function useOrderForm(initialData?: Partial<OrderForm>) {
    const [data, setData] = useState<OrderForm>({
        ...initialFormData,
        ...initialData,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const updateField = useCallback(
        <K extends keyof OrderForm>(field: K, value: OrderForm[K]) => {
            setData((prev) => ({ ...prev, [field]: value }));
            // Clear error for this field when user starts typing
            if (errors[field]) {
                setErrors((prev) => ({ ...prev, [field]: '' }));
            }
        },
        [errors],
    );

    const addItem = useCallback(() => {
        setData((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    product_type_id: '',
                    product_size_id: '',
                    quantity: 1,
                    price: '0',
                    notes: '',
                },
            ],
        }));
    }, []);

    const updateItem = useCallback(
        (
            index: number,
            field: keyof OrderForm['items'][0],
            value: string | number,
        ) => {
            setData((prev) => ({
                ...prev,
                items: prev.items.map((item, i) =>
                    i === index ? { ...item, [field]: value } : item,
                ),
            }));
        },
        [],
    );

    const removeItem = useCallback((index: number) => {
        setData((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    }, []);

    const calculateTotal = useCallback(() => {
        const subtotal = data.items.reduce((total, item) => {
            return total + parseFloat(item.price) * item.quantity;
        }, 0);

        const discountAmount = parseFloat(data.discount_amount) || 0;
        let discount = 0;

        if (data.discount_type === 'percentage') {
            discount = (subtotal * discountAmount) / 100;
        } else {
            discount = discountAmount;
        }

        return Math.max(0, subtotal - discount);
    }, [data.items, data.discount_amount, data.discount_type]);

    const submit = useCallback(
        async (method: 'POST' | 'PUT' = 'POST', url?: string) => {
            try {
                setProcessing(true);
                setErrors({});

                if (method === 'POST') {
                    await OrderService.createOrder(data);
                    router.visit('/orders', {
                        method: 'get',
                        data: {},
                        replace: true,
                    });
                } else if (url) {
                    await OrderService.updateOrder(url.split('/').pop()!, data);
                    router.visit(url, {
                        method: 'get',
                        data: {},
                        replace: true,
                    });
                }
            } catch (error: unknown) {
                const err = error as {
                    response?: { data?: { errors?: Record<string, string[]> } };
                };
                if (err.response?.data?.errors) {
                    // Flatten array errors to single strings
                    const flattenedErrors: Record<string, string> = {};
                    Object.entries(err.response.data.errors).forEach(([key, messages]) => {
                        flattenedErrors[key] = Array.isArray(messages) ? messages[0] : messages;
                    });
                    setErrors(flattenedErrors);
                } else {
                    setErrors({
                        general: 'An error occurred while saving the order.',
                    });
                }
                throw error;
            } finally {
                setProcessing(false);
            }
        },
        [data],
    );

    const reset = useCallback(() => {
        setData({ ...initialFormData, ...initialData });
        setErrors({});
    }, [initialData]);

    return {
        data,
        errors,
        processing,
        updateField,
        addItem,
        updateItem,
        removeItem,
        calculateTotal,
        submit,
        reset,
    };
}
