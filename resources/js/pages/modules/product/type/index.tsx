import { ProductTypeList } from '@/modules/product/components';
import { type ProductType } from '@/modules/product/types';
import { destroy } from '@/routes/product-types';
import {
    ConfirmDialog,
    MainPageLayout,
    useDeleteDialog,
} from '@/shared/components';
import { useInertiaProps } from '@/shared/hooks/UseInertiaProps';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface ProductTypeIndexProps {
    productTypes: ProductType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Types',
        href: '/product-types',
    },
];

export default function ProductTypesIndex() {
    const { productTypes } = useInertiaProps<ProductTypeIndexProps>();

    const deleteDialog = useDeleteDialog<ProductType>({
        getItemName: (productType) => productType.name,
        onDelete: (productType) => {
            router.delete(destroy(productType.id));
        },
    });

    return (
        <MainPageLayout
            title="Product Types"
            description="Manage product types and their sizes"
            breadcrumbs={breadcrumbs}
            createButton={{
                label: 'Add Product Type',
                href: '/product-types/create',
                icon: Plus,
                permission: 'product-types.create',
            }}
            useCard={false}
        >
            <ProductTypeList
                productTypes={productTypes}
                onDelete={deleteDialog.show}
            />

            <ConfirmDialog
                {...deleteDialog.dialogProps}
                title="Delete Product Type"
                description={`Are you sure you want to delete "${deleteDialog.itemName}"? This action cannot be undone.`}
            />
        </MainPageLayout>
    );
}
