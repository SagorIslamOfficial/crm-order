import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import type { ProductSizeForm } from '../types';

const initialFormData: ProductSizeForm = {
    product_type_id: '',
    size_label: '',
    is_active: true,
};

export function useProductSizeForm(initialData?: Partial<ProductSizeForm>) {
    const [data, setData] = useState<ProductSizeForm>({
        ...initialFormData,
        ...initialData,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const updateField = useCallback(
        <K extends keyof ProductSizeForm>(
            field: K,
            value: ProductSizeForm[K],
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

            const url = method === 'POST' ? '/api/product-sizes' : `/api/product-sizes/${id}`;
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
