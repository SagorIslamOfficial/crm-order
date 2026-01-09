import { FormActions, InfoCard } from '@/components/common';
import type {
    ProductType,
    ProductTypeForm,
} from '@/components/modules/product/type/types/Product.types';
import {
    index as productTypesIndex,
    update as productTypesUpdate,
} from '@/routes/product-types';
import { router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { BasicEdit } from './edit';

interface ProductTypeEditFormProps {
    productType: ProductType;
    className?: string;
}

export function ProductTypeEditForm({
    productType,
    className,
}: ProductTypeEditFormProps) {
    const { data, setData, put, processing, errors } = useForm<ProductTypeForm>(
        {
            name: productType.name,
            description: productType.description || undefined,
            is_active: !!productType.is_active,
        },
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(productTypesUpdate(productType.id).url, {
            onSuccess: () => {
                toast.success('Product type updated successfully');
            },
        });
    };

    const updateField = <K extends keyof ProductTypeForm>(
        field: K,
        value: ProductTypeForm[K],
    ) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setData(field, value as any);
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            <InfoCard title="Product Type Details">
                <BasicEdit data={data} errors={errors} onChange={updateField} />
            </InfoCard>

            <FormActions
                onCancel={() => router.visit(productTypesIndex().url)}
                submitLabel="Update Product Type"
                isProcessing={processing}
                className="mt-6"
            />
        </form>
    );
}
