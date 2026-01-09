import { FormActions, InfoCard } from '@/components/common';
import { InputField } from '@/components/common/InputField';
import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import {
    index as productTypesIndex,
    store as productTypesStore,
} from '@/routes/product-types';
import { type BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Product Types',
        href: productTypesIndex().url,
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function ProductTypesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        is_active: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(productTypesStore().url);
    };

    return (
        <MainPageLayout
            title="Create Product Type"
            description="Add a new product type to the system"
            breadcrumbs={breadcrumbs}
            backButton={{
                href: productTypesIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
                <InfoCard title="Product Type Details">
                    <div className="space-y-6">
                        <InputField
                            id="name"
                            label="Name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Product type name"
                            error={errors.name}
                            required
                        />

                        <InputField
                            textarea
                            id="description"
                            label="Description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Product type description"
                            rows={3}
                            error={errors.description}
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
                    onCancel={() => router.visit(productTypesIndex().url)}
                    submitLabel="Create Product Type"
                    cancelLabel="Cancel"
                    isProcessing={processing}
                    className="mt-6"
                />
            </form>
        </MainPageLayout>
    );
}
