import {
    CommonDataTable,
    ConfirmDialog,
    DataTableExport,
} from '@/components/common';
import {
    MainPageLayout,
    useDeleteDialog,
} from '@/components/common/layout/MainPageLayout';
import { UseProductSizeColumns } from '@/components/modules/product/size/UseProductSizeColumns';
import type {
    ProductSize,
    ProductSizeIndexProps,
} from '@/components/modules/product/size/types/Product.types';
import { useInertiaProps } from '@/hooks';
import { dashboard } from '@/routes';
import {
    create as productSizesCreate,
    destroy as productSizesDestroy,
    index as productSizesIndex,
} from '@/routes/product-sizes';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import type { Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Product Sizes',
        href: productSizesIndex().url,
    },
];

export default function ProductSizesIndex() {
    const { productSizes } = useInertiaProps<ProductSizeIndexProps>();
    const searchParams = new URLSearchParams(window.location.search);
    const [globalFilter, setGlobalFilter] = React.useState(
        searchParams.get('search') || '',
    );
    const [table, setTable] = React.useState<Table<ProductSize> | null>(null);

    const deleteDialog = useDeleteDialog<ProductSize>({
        getItemName: (productSize) => productSize.size_label,
        onDelete: (productSize) => {
            router.delete(productSizesDestroy(productSize.id).url);
        },
    });

    const columns = UseProductSizeColumns({
        onDelete: (productSize) => deleteDialog.show(productSize),
    });

    const exportColumns = [
        { key: 'size_label', label: 'Size Label' },
        { key: 'product_type.name', label: 'Product Type' },
        { key: 'is_active', label: 'Active' },
    ];

    return (
        <MainPageLayout
            title="Product Sizes"
            description="Manage product sizes for different product types"
            breadcrumbs={breadcrumbs}
            useCard={false}
            search={{
                value: globalFilter,
                placeholder: 'Search product sizes...',
                onSearch: (value) => {
                    setGlobalFilter(value);
                    router.get(
                        productSizesIndex().url,
                        { search: value },
                        { preserveState: true, preserveScroll: true },
                    );
                },
            }}
            createButton={{
                label: 'New Product Size',
                href: productSizesCreate().url,
                icon: Plus,
                permission: 'product-sizes.create',
            }}
            columnsButton={
                table && (
                    <DataTableExport
                        table={table}
                        filename="product-sizes"
                        columns={exportColumns}
                    />
                )
            }
        >
            <div className="space-y-4">
                <CommonDataTable
                    columns={columns}
                    data={productSizes}
                    globalFilterValue={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    onTableChange={setTable}
                />
            </div>

            <ConfirmDialog
                {...deleteDialog.dialogProps}
                title="Delete Product Size"
                description={`Are you sure you want to delete "${deleteDialog.itemName}"? This action cannot be undone.`}
            />
        </MainPageLayout>
    );
}
