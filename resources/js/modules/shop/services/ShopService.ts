import { destroy, index, show, store, update } from '@/routes/shops';
import { router } from '@inertiajs/react';
import type { Shop, ShopFilters, ShopForm } from '../types';

export class ShopService {
    static async getShops(filters?: ShopFilters): Promise<{
        data: Shop[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    }> {
        return new Promise((resolve) => {
            router.get(
                index(),
                filters ? { search: filters.search } : undefined,
                {
                    onSuccess: (page) =>
                        resolve(
                            page.props.shops as {
                                data: Shop[];
                                current_page: number;
                                last_page: number;
                                per_page: number;
                                total: number;
                                from: number;
                                to: number;
                                prev_page_url: string | null;
                                next_page_url: string | null;
                            },
                        ),
                },
            );
        });
    }

    static async getShop(id: string): Promise<Shop> {
        return new Promise((resolve) => {
            router.get(show(id), undefined, {
                onSuccess: (page) => resolve(page.props.shop as Shop),
            });
        });
    }

    static async createShop(data: ShopForm): Promise<Shop> {
        return new Promise((resolve, reject) => {
            router.post(store(), { ...data } as unknown as FormData, {
                onSuccess: (page) => resolve(page.props.shop as Shop),
                onError: (errors: unknown) =>
                    reject(
                        new Error(
                            Object.values(
                                errors as Record<string, unknown>,
                            )[0] as string,
                        ),
                    ),
            });
        });
    }

    static async updateShop(id: string, data: ShopForm): Promise<Shop> {
        return new Promise((resolve, reject) => {
            router.put(update(id), { ...data } as unknown as FormData, {
                onSuccess: (page) => resolve(page.props.shop as Shop),
                onError: (errors: unknown) =>
                    reject(
                        new Error(
                            Object.values(
                                errors as Record<string, unknown>,
                            )[0] as string,
                        ),
                    ),
            });
        });
    }

    static async deleteShop(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            router.delete(destroy(id), {
                onSuccess: () => resolve(),
                onError: (errors: unknown) =>
                    reject(
                        new Error(
                            Object.values(
                                errors as Record<string, unknown>,
                            )[0] as string,
                        ),
                    ),
            });
        });
    }
}
