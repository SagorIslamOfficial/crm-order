import {
    CommonDataTable,
    ConfirmDialog,
    DataTableExport,
} from '@/components/common';
import {
    MainPageLayout,
    useDeleteDialog,
} from '@/components/common/layout/MainPageLayout';
import { UseShopColumns } from '@/components/modules/shop';
import type { Shop } from '@/components/modules/shop/types/Shop.types';
import { useInertiaProps } from '@/hooks';
import { dashboard } from '@/routes';
import {
    create as shopsCreate,
    destroy as shopsDestroy,
    index as shopsIndex,
} from '@/routes/shops';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { router } from '@inertiajs/react';
import type { Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import * as React from 'react';

interface ShopIndexProps extends PageProps {
    shops: {
        data: Shop[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Shops',
        href: shopsIndex().url,
    },
];

export default function ShopIndex() {
    const { shops } = useInertiaProps<ShopIndexProps>();
    const searchParams = new URLSearchParams(window.location.search);
    const [globalFilter, setGlobalFilter] = React.useState(
        searchParams.get('search') || '',
    );
    const [table, setTable] = React.useState<Table<Shop> | null>(null);

    const deleteDialog = useDeleteDialog<Shop>({
        getItemName: (shop) => shop.name,
        onDelete: (shop) => {
            router.delete(shopsDestroy(shop.id).url);
        },
    });

    const columns = UseShopColumns({
        onDelete: (shop) => deleteDialog.show(shop),
    });

    const exportColumns = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'address', label: 'Address' },
        { key: 'phone', label: 'Phone' },
        { key: 'website', label: 'Website' },
        { key: 'orders_count', label: 'Orders' },
        { key: 'is_active', label: 'Active' },
    ];

    return (
        <MainPageLayout
            title="Shops"
            description="Manage shops and their details"
            breadcrumbs={breadcrumbs}
            useCard={false}
            search={{
                value: globalFilter,
                placeholder: 'Search shops...',
                onSearch: (value) => {
                    setGlobalFilter(value);
                    router.get(
                        shopsIndex().url,
                        { search: value },
                        { preserveState: true, preserveScroll: true },
                    );
                },
            }}
            createButton={{
                label: 'Add Shop',
                href: shopsCreate().url,
                icon: Plus,
            }}
            columnsButton={
                table && (
                    <DataTableExport
                        table={table}
                        filename="shops"
                        columns={exportColumns}
                    />
                )
            }
        >
            <div className="space-y-4">
                <CommonDataTable
                    columns={columns}
                    data={shops}
                    globalFilterValue={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    onTableChange={setTable}
                />
            </div>

            <ConfirmDialog
                {...deleteDialog.dialogProps}
                title="Delete Shop"
                description={`Are you sure you want to delete "${deleteDialog.itemName}"? This action cannot be undone.`}
            />
        </MainPageLayout>
    );
}
