import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { ProductTypeShow } from '@/components/modules/product/type/ProductTypeShow';
import type { ProductTypeShowProps } from '@/components/modules/product/type/types/Product.types';
import { dashboard } from '@/routes';
import {
    edit as productTypesEdit,
    index as productTypesIndex,
    show as productTypesShow,
} from '@/routes/product-types';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit } from 'lucide-react';

export default function ProductTypesShowPage({
    productType,
    sizes,
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
    ];

    return (
        <MainPageLayout
            title={productType.name}
            description={`Created ${new Date(productType.created_at).toLocaleDateString()}`}
            breadcrumbs={breadcrumbs}
            backButton={{
                href: productTypesIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            editButton={{
                href: productTypesEdit(productType.id).url,
                icon: Edit,
                label: 'Edit',
            }}
            useCard={false}
        >
            <ProductTypeShow
                productType={productType}
                sizes={sizes}
                className="rounded-xl border border-sidebar-border/70 p-6"
            />
        </MainPageLayout>
    );
}
