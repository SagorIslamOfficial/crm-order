import {
    CommonDataTable,
    ConfirmDialog,
    DataTableExport,
} from '@/components/common';
import {
    MainPageLayout,
    useDeleteDialog,
} from '@/components/common/layout/MainPageLayout';
import { UseProductTypeColumns } from '@/components/modules/product/type/UseProductTypeColumns';
import type {
    ProductType,
    ProductTypeIndexProps,
} from '@/components/modules/product/type/types/Product.types';
import { useInertiaProps } from '@/hooks';
import { dashboard } from '@/routes';
import {
    create as productTypesCreate,
    destroy as productTypesDestroy,
    index as productTypesIndex,
} from '@/routes/product-types';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { type Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Product Types',
        href: productTypesIndex().url,
    },
];

export default function ProductTypesIndex() {
    const { productTypes } = useInertiaProps<ProductTypeIndexProps>();
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [table, setTable] = React.useState<Table<ProductType> | null>(null);

    const deleteDialog = useDeleteDialog<ProductType>({
        getItemName: (productType) => productType.name,
        onDelete: (productType) => {
            router.delete(productTypesDestroy(productType.id).url);
        },
    });

    const columns = UseProductTypeColumns({
        onDelete: (productType) => deleteDialog.show(productType),
    });

    const exportColumns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'sizes_count', label: 'Sizes' },
        { key: 'orders_count', label: 'Orders' },
        { key: 'is_active', label: 'Active' },
    ];

    return (
        <MainPageLayout
            title="Product Types"
            description="Manage product types and their sizes"
            breadcrumbs={breadcrumbs}
            useCard={false}
            search={{
                value: globalFilter,
                placeholder: 'Search by name or description...',
                onSearch: (value) => {
                    setGlobalFilter(value);
                    router.get(
                        productTypesIndex().url,
                        { search: value },
                        { preserveState: true, preserveScroll: true },
                    );
                },
            }}
            createButton={{
                label: 'New Product Type',
                href: productTypesCreate().url,
                icon: Plus,
                permission: 'product-types.create',
            }}
            columnsButton={
                table && (
                    <DataTableExport
                        table={table}
                        filename="product-types"
                        columns={exportColumns}
                    />
                )
            }
        >
            <div className="space-y-4">
                <CommonDataTable
                    columns={columns}
                    data={productTypes}
                    globalFilterValue={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    onTableChange={setTable}
                />
            </div>

            <ConfirmDialog
                {...deleteDialog.dialogProps}
                title="Delete Product Type"
                description={`Are you sure you want to delete product type "${deleteDialog.itemName}"? This action cannot be undone.`}
            />
        </MainPageLayout>
    );
}
