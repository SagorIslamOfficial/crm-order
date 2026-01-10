import { FormActions, InfoCard, SelectField } from '@/components/common';
import { InputField } from '@/components/common/InputField';
import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { type ProductType } from '@/components/modules/product/size/types/Product.types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useInertiaProps } from '@/hooks';
import { dashboard } from '@/routes';
import {
    index as productSizesIndex,
    store as productSizesStore,
} from '@/routes/product-sizes';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';

interface ProductSizeCreateProps extends PageProps {
    productTypes: ProductType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Product Sizes',
        href: productSizesIndex().url,
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function ProductSizesCreate() {
    const { productTypes } = useInertiaProps<ProductSizeCreateProps>();
    const { data, setData, post, processing, errors } = useForm({
        product_type_id: '',
        size_label: '',
        is_active: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(productSizesStore().url);
    };

    return (
        <MainPageLayout
            title="Create Product Size"
            description="Add a new product size to the system"
            breadcrumbs={breadcrumbs}
            backButton={{
                href: productSizesIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
                <InfoCard title="Product Size Details">
                    <div className="space-y-6">
                        <SelectField
                            label="Product Type"
                            value={data.product_type_id}
                            onValueChange={(value: string) =>
                                setData('product_type_id', value)
                            }
                            options={productTypes.map((pt) => ({
                                label: pt.name,
                                value: pt.id,
                            }))}
                            placeholder="Select a product type"
                            error={errors.product_type_id}
                            required
                        />

                        <InputField
                            id="size_label"
                            label="Size Label"
                            type="text"
                            value={data.size_label}
                            onChange={(e) =>
                                setData('size_label', e.target.value)
                            }
                            placeholder="e.g., Small, Medium, Large"
                            error={errors.size_label}
                            required
                        />

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) =>
                                    setData('is_active', !!checked)
                                }
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>

                        {errors.is_active && (
                            <p className="text-xs font-medium text-destructive">
                                {errors.is_active}
                            </p>
                        )}
                    </div>
                </InfoCard>

                <FormActions
                    onCancel={() => router.visit(productSizesIndex().url)}
                    submitLabel="Create Product Size"
                    cancelLabel="Cancel"
                    isProcessing={processing}
                    className="mt-6"
                />
            </form>
        </MainPageLayout>
    );
}
