import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { ProductSizeShow } from '@/components/modules/product/size/ProductSizeShow';
import type { ProductSize } from '@/components/modules/product/size/types/Product.types';
import { dashboard } from '@/routes';
import {
    edit as productSizesEdit,
    index as productSizesIndex,
    show as productSizesShow,
} from '@/routes/product-sizes';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit } from 'lucide-react';

interface Props {
    productSize: ProductSize;
}

export default function ProductSizesShowPage({ productSize }: Props) {
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
            title: productSize.size_label,
            href: productSizesShow(productSize.id).url,
        },
    ];

    return (
        <MainPageLayout
            title={productSize.size_label}
            description={`${productSize.product_type?.name || 'Product Type'} - Created ${new Date(productSize.created_at).toLocaleDateString()}`}
            breadcrumbs={breadcrumbs}
            backButton={{
                href: productSizesIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            editButton={{
                href: productSizesEdit(productSize.id).url,
                icon: Edit,
                label: 'Edit',
            }}
            useCard={false}
        >
            <ProductSizeShow
                productSize={productSize}
                className="rounded-xl border border-sidebar-border/70 p-6"
            />
        </MainPageLayout>
    );
}
