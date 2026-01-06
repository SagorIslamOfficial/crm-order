import { useForm } from '@inertiajs/react';
import { useCallback, useEffect } from 'react';
import { ShopService } from '../services/ShopService';
import type { Shop, ShopForm } from '../types';

interface UseShopFormOptions {
    shop?: Shop;
    onSuccess?: () => void;
    onError?: (errors: Record<string, string>) => void;
}

export function useShopForm({
    shop,
    onSuccess,
    onError,
}: UseShopFormOptions = {}) {
    const form = useForm<ShopForm>({
        code: shop?.code || '',
        name: shop?.name || '',
        address: shop?.address || '',
        phone: shop?.phone || '',
        website: shop?.website || '',
        location: shop?.location || '',
        details: shop?.details || '',
        is_active: shop?.is_active ?? true,
        next_order_sequence: shop?.next_order_sequence || 1,
    });

    useEffect(() => {
        if (shop) {
            form.setData({
                code: shop.code,
                name: shop.name,
                address: shop.address,
                phone: shop.phone,
                website: shop.website,
                location: shop.location,
                details: shop.details,
                is_active: shop.is_active,
                next_order_sequence: shop.next_order_sequence,
            });
        }
    }, [shop, form]);

    const submit = useCallback(
        async (method: 'post' | 'put' = 'post', url?: string) => {
            try {
                form.clearErrors();

                if (method === 'post') {
                    await ShopService.createShop(form.data);
                } else if (method === 'put' && url) {
                    const shopId = url.split('/').pop();
                    if (shopId) {
                        await ShopService.updateShop(shopId, form.data);
                    }
                }

                form.reset();
                onSuccess?.();
            } catch (error: unknown) {
                const err = error as {
                    response?: {
                        data?: {
                            errors?: Record<string, string[]>;
                            message?: string;
                        };
                    };
                    message?: string;
                };
                if (err?.response?.data?.errors) {
                    // Set individual field errors
                    Object.entries(err.response.data.errors).forEach(([field, messages]) => {
                        if (Array.isArray(messages) && messages.length > 0) {
                            form.setError(field as keyof ShopForm, messages[0]);
                        }
                    });
                    onError?.(err.response.data.errors as unknown as Record<string, string>);
                } else {
                    const errorMessage =
                        err?.response?.data?.message ||
                        err?.message ||
                        'An error occurred';
                    // Don't set a general error, just call onError
                    onError?.({ general: errorMessage });
                }
            }
        },
        [form, onSuccess, onError],
    );

    const reset = useCallback(() => {
        form.reset();
        form.clearErrors();
    }, [form]);

    return {
        ...form,
        submit,
        reset,
    };
}
