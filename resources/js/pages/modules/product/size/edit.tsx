import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { ProductSizeEditForm } from '@/components/modules/product/size/ProductSizeEditForm';
import {
    type ProductSize,
    type ProductType,
} from '@/components/modules/product/size/types/Product.types';
import { dashboard } from '@/routes';
import {
    index as productSizesIndex,
    show as productSizesShow,
} from '@/routes/product-sizes';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-react';

interface ProductSizeEditProps {
    productSize: ProductSize;
    productTypes: ProductType[];
}

export default function ProductSizesEdit({
    productSize,
    productTypes,
}: ProductSizeEditProps) {
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
        {
            title: 'Edit',
            href: '#',
        },
    ];

    return (
        <MainPageLayout
            title={`Edit ${productSize.size_label}`}
            description="Update product size information"
            breadcrumbs={breadcrumbs}
            backButton={{
                href: productSizesShow(productSize.id).url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <div className="mx-auto max-w-2xl">
                <ProductSizeEditForm
                    productSize={productSize}
                    productTypes={productTypes}
                />
            </div>
        </MainPageLayout>
    );
}
