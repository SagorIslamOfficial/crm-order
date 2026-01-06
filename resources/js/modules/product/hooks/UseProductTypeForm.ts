import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { ProductService } from '../services/ProductService';
import type { ProductTypeForm } from '../types';

export function useProductTypeForm(initialData?: Partial<ProductTypeForm>) {
    const [data, setData] = useState<ProductTypeForm>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        is_active: initialData?.is_active ?? true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const updateField = useCallback(
        (field: keyof ProductTypeForm, value: string | boolean) => {
            setData((prev) => ({ ...prev, [field]: value }));
            // Clear error when user starts typing
            if (errors[field]) {
                setErrors((prev) => ({ ...prev, [field]: '' }));
            }
        },
        [errors],
    );

    const submit = useCallback(
        async (url: string, method: 'post' | 'put' = 'post') => {
            try {
                setProcessing(true);
                setErrors({});

                if (method === 'post') {
                    await ProductService.createProductType(data);
                } else {
                    throw new Error('Update method requires product type ID');
                }

                router.visit(url, {
                    method: 'get',
                    replace: true,
                });
            } catch (err: unknown) {
                const error = err as {
                    response?: { data?: { errors?: Record<string, string[]> } };
                    message?: string;
                };
                if (error?.response?.data?.errors) {
                    // Flatten array errors to single strings
                    const flattenedErrors: Record<string, string> = {};
                    Object.entries(error.response.data.errors).forEach(
                        ([key, messages]) => {
                            flattenedErrors[key] = Array.isArray(messages)
                                ? messages[0]
                                : messages;
                        },
                    );
                    setErrors(flattenedErrors);
                } else {
                    setErrors({
                        general: error.message || 'An error occurred',
                    });
                }
            } finally {
                setProcessing(false);
            }
        },
        [data],
    );

    const reset = useCallback(() => {
        setData({
            name: '',
            description: '',
            is_active: true,
        });
        setErrors({});
    }, []);

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
