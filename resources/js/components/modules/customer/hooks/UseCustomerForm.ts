import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
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
            setProcessing(true);
            setErrors({});

            const url =
                method === 'POST' ? '/api/customers' : `/api/customers/${id}`;
            const httpMethod = method === 'POST' ? 'post' : 'put';

            router[httpMethod](url, data, {
                onError: (responseErrors) => {
                    setErrors(responseErrors as Record<string, string>);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            });
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
