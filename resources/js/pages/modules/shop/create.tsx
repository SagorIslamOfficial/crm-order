import { FormActions, InfoCard } from '@/components/common';
import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { ShopFormFields, useShopForm } from '@/components/modules/shop';
import { index as shopsIndex } from '@/routes/shops';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shops',
        href: shopsIndex().url,
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function ShopsCreate() {
    const { data, errors, processing, updateField, submit } = useShopForm();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await submit('POST');
        } catch (error) {
            console.error('Failed to create shop:', error);
        }
    };

    return (
        <MainPageLayout
            title="Create Shop"
            description="Add a new shop to the system"
            breadcrumbs={breadcrumbs}
            backButton={{
                label: 'Back',
                href: shopsIndex().url,
                icon: ArrowLeft,
            }}
            useCard={false}
        >
            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
                <InfoCard title="Shop Details">
                    <ShopFormFields
                        data={data}
                        errors={errors}
                        onChange={updateField}
                    />
                </InfoCard>

                <FormActions
                    onCancel={() => router.visit(shopsIndex().url)}
                    submitLabel="Create Shop"
                    isProcessing={processing}
                    className="mt-6"
                />
            </form>
        </MainPageLayout>
    );
}
