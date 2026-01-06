import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { CustomerService } from '../services/CustomerService';
import type { CustomerForm } from '../types';

const initialFormData: CustomerForm = {
    phone: '',
    name: '',
    address: '',
};

export function useCustomerForm(initialData?: Partial<CustomerForm>) {
    const [data, setData] = useState<CustomerForm>({
        ...initialFormData,
        ...initialData,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const updateField = useCallback(
        <K extends keyof CustomerForm>(field: K, value: CustomerForm[K]) => {
            setData((prev) => ({ ...prev, [field]: value }));
            if (errors[field]) {
                setErrors((prev) => ({ ...prev, [field]: '' }));
            }
        },
        [errors],
    );

    const submit = useCallback(
        async (method: 'POST' | 'PUT' = 'POST', id?: string) => {
            try {
                setProcessing(true);
                setErrors({});

                if (method === 'POST') {
                    await CustomerService.createCustomer(data);
                    router.visit('/customers', {
                        method: 'get',
                        replace: true,
                    });
                } else if (id) {
                    await CustomerService.updateCustomer(id, data);
                    router.visit(`/customers/${id}`, {
                        method: 'get',
                        replace: true,
                    });
                }
            } catch (error: unknown) {
                const err = error as {
                    response?: { data?: { errors?: Record<string, string[]> } };
                };
                if (err.response?.data?.errors) {
                    const flattenedErrors: Record<string, string> = {};
                    Object.entries(err.response.data.errors).forEach(
                        ([key, messages]) => {
                            flattenedErrors[key] = Array.isArray(messages)
                                ? messages[0]
                                : messages;
                        },
                    );
                    setErrors(flattenedErrors);
                } else {
                    setErrors({
                        general: 'An error occurred while saving customer.',
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
        submit,
        reset,
    };
}
