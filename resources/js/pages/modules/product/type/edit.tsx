import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { ProductTypeEditForm } from '@/components/modules/product/type/ProductTypeEditForm';
import type { ProductTypeShowProps } from '@/components/modules/product/type/types/Product.types';
import { dashboard } from '@/routes';
import {
    index as productTypesIndex,
    show as productTypesShow,
} from '@/routes/product-types';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-react';

export default function ProductTypesEdit({
    productType,
}: ProductTypeShowProps) {
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
            title: productType.name,
            href: productTypesShow(productType.id).url,
        },
        {
            title: 'Edit',
            href: '#',
        },
    ];

    return (
        <MainPageLayout
            title={`Edit ${productType.name}`}
            description="Update product type information"
            breadcrumbs={breadcrumbs}
            backButton={{
                href: productTypesShow(productType.id).url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <div className="mx-auto max-w-2xl">
                <ProductTypeEditForm productType={productType} />
            </div>
        </MainPageLayout>
    );
}
