import { FormActions, InfoCard } from '@/components/common';
import type {
    ProductSize,
    ProductSizeForm,
} from '@/components/modules/product/size/types/Product.types';
import {
    index as productSizesIndex,
    update as productSizesUpdate,
} from '@/routes/product-sizes';
import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { BasicEdit } from './edit';

interface ProductSizeEditFormProps {
    productSize: ProductSize;
    productTypes?: Array<{ id: string; name: string }>;
    className?: string;
}

export function ProductSizeEditForm({
    productSize,
    productTypes = [],
    className,
}: ProductSizeEditFormProps) {
    const { data, setData, put, processing, errors } = useForm<ProductSizeForm>(
        {
            product_type_id: productSize.product_type_id,
            size_label: productSize.size_label,
            is_active: !!productSize.is_active,
        },
    );

    const handleChange = (field: keyof ProductSizeForm, value: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setData(field, value as any);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(productSizesUpdate(productSize.id).url, {
            onSuccess: () => {
                toast.success('Product size updated successfully');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            <InfoCard title="Product Size Details">
                <BasicEdit
                    data={data}
                    errors={errors}
                    productTypes={productTypes}
                    onChange={handleChange}
                />
            </InfoCard>

            <FormActions
                onCancel={() => router.visit(productSizesIndex().url)}
                submitLabel="Update Product Size"
                isProcessing={processing}
                className="mt-6"
            />
        </form>
    );
}
