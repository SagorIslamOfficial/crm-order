import {
    destroy,
    byType as getSizesByType,
    index,
    show,
    store,
    update,
} from '@/routes/product-sizes';
import {
    destroy as destroyType,
    index as indexType,
    show as showType,
    store as storeType,
    update as updateType,
} from '@/routes/product-types';
import { router } from '@inertiajs/react';
import type {
    ProductSize,
    ProductSizeFilters,
    ProductSizeForm,
    ProductType,
    ProductTypeFilters,
    ProductTypeForm,
} from '../types';

export class ProductService {
    // Product Types
    static async getProductTypes(filters?: ProductTypeFilters): Promise<{
        data: ProductType[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    }> {
        return new Promise((resolve) => {
            router.get(
                indexType(),
                filters ? { search: filters.search } : undefined,
                {
                    onSuccess: (page) =>
                        resolve(
                            page.props.productTypes as {
                                data: ProductType[];
                                current_page: number;
                                last_page: number;
                                per_page: number;
                                total: number;
                            },
                        ),
                },
            );
        });
    }

    static async getProductType(id: string): Promise<ProductType> {
        return new Promise((resolve) => {
            router.get(showType(id), undefined, {
                onSuccess: (page) =>
                    resolve(page.props.productType as ProductType),
            });
        });
    }

    static async createProductType(
        data: ProductTypeForm,
    ): Promise<ProductType> {
        return new Promise((resolve, reject) => {
            router.post(storeType(), { ...data } as unknown as FormData, {
                onSuccess: (page) =>
                    resolve(page.props.productType as ProductType),
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

    static async updateProductType(
        id: string,
        data: ProductTypeForm,
    ): Promise<ProductType> {
        return new Promise((resolve, reject) => {
            router.put(updateType(id), { ...data } as unknown as FormData, {
                onSuccess: (page) =>
                    resolve(page.props.productType as ProductType),
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

    static async deleteProductType(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            router.delete(destroyType(id), {
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

    // Product Sizes
    static async getProductSizes(filters?: ProductSizeFilters): Promise<{
        data: ProductSize[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    }> {
        return new Promise((resolve) => {
            router.get(
                index(),
                filters ? { search: filters.search } : undefined,
                {
                    onSuccess: (page) =>
                        resolve(
                            page.props.productSizes as {
                                data: ProductSize[];
                                current_page: number;
                                last_page: number;
                                per_page: number;
                                total: number;
                            },
                        ),
                },
            );
        });
    }

    static async getProductSize(id: string): Promise<ProductSize> {
        return new Promise((resolve) => {
            router.get(show(id), undefined, {
                onSuccess: (page) =>
                    resolve(page.props.productSize as ProductSize),
            });
        });
    }

    static async createProductSize(
        data: ProductSizeForm,
    ): Promise<ProductSize> {
        return new Promise((resolve, reject) => {
            router.post(store(), { ...data } as unknown as FormData, {
                onSuccess: (page) =>
                    resolve(page.props.productSize as ProductSize),
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

    static async updateProductSize(
        id: string,
        data: ProductSizeForm,
    ): Promise<ProductSize> {
        return new Promise((resolve, reject) => {
            router.put(update(id), { ...data } as unknown as FormData, {
                onSuccess: (page) =>
                    resolve(page.props.productSize as ProductSize),
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

    static async deleteProductSize(id: string): Promise<void> {
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

    static async getProductSizesByType(
        productTypeId: string,
    ): Promise<ProductSize[]> {
        return new Promise((resolve) => {
            router.get(
                getSizesByType(),
                { product_type_id: productTypeId },
                {
                    onSuccess: (page) =>
                        resolve(page.props.productSizes as ProductSize[]),
                },
            );
        });
    }
}
