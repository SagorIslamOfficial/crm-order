import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import type { ShopForm } from '../types/Shop.types';

const initialFormData: ShopForm = {
    code: '',
    name: '',
    address: '',
    phone: '',
    website: '',
    details: '',
    is_active: true,
    next_order_sequence: 1,
};

export function useShopForm(initialData?: Partial<ShopForm>) {
    const [data, setData] = useState<ShopForm>({
        ...initialFormData,
        ...initialData,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const updateField = useCallback(
        <K extends keyof ShopForm>(field: K, value: ShopForm[K]) => {
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

            const url = method === 'POST' ? '/shops' : `/shops/${id}`;
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
