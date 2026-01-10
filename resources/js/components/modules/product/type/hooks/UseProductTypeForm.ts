import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import type { ProductTypeForm } from '../types';

const initialFormData: ProductTypeForm = {
    name: '',
    description: '',
    is_active: true,
};

export function useProductTypeForm(initialData?: Partial<ProductTypeForm>) {
    const [data, setData] = useState<ProductTypeForm>({
        ...initialFormData,
        ...initialData,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const updateField = useCallback(
        <K extends keyof ProductTypeForm>(
            field: K,
            value: ProductTypeForm[K],
        ) => {
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

            const url = method === 'POST' ? '/api/product-types' : `/api/product-types/${id}`;
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
        setData,
        setErrors,
    };
}
