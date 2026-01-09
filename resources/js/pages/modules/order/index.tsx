import {
    CommonDataTable,
    DataTableExport,
    DeleteDialog,
} from '@/components/common';
import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { UseOrderColumns } from '@/components/modules/order';
import type { Order, OrderIndexProps } from '@/components/modules/order/types';
import { useInertiaProps } from '@/hooks';
import {
    create as ordersCreate,
    destroy as ordersDestroy,
    index as ordersIndex,
} from '@/routes/orders';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { type Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: ordersIndex().url,
    },
];

export default function OrderIndex() {
    const { orders } = useInertiaProps<OrderIndexProps>();
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [table, setTable] = React.useState<Table<Order> | null>(null);
    const [deletingOrder, setDeletingOrder] = React.useState<Order | null>(
        null,
    );

    const columns = UseOrderColumns({
        onDelete: setDeletingOrder,
    });

    const exportColumns = [
        { key: 'order_number', label: 'Order #' },
        { key: 'customer.name', label: 'Customer' },
        { key: 'shop.name', label: 'Shop' },
        { key: 'total_amount', label: 'Total' },
        { key: 'due_amount', label: 'Due' },
        { key: 'status', label: 'Status' },
        { key: 'delivery_date', label: 'Delivery Date' },
    ];

    const handleDelete = () => {
        if (!deletingOrder) return;

        router.delete(ordersDestroy(deletingOrder.id).url, {
            onSuccess: () => setDeletingOrder(null),
        });
    };

    return (
        <>
            <MainPageLayout
                title="Orders"
                description="Manage your customer orders"
                breadcrumbs={breadcrumbs}
                useCard={false}
                search={{
                    value: globalFilter,
                    placeholder: 'Search orders...',
                    onSearch: (value) => {
                        setGlobalFilter(value);
                        router.get(
                            ordersIndex().url,
                            { search: value },
                            { preserveState: true, preserveScroll: true },
                        );
                    },
                }}
                createButton={{
                    label: 'New Order',
                    href: ordersCreate().url,
                    icon: Plus,
                }}
                columnsButton={
                    table && (
                        <DataTableExport
                            table={table}
                            filename="orders"
                            columns={exportColumns}
                        />
                    )
                }
            >
                <div className="space-y-4">
                    <CommonDataTable
                        columns={columns}
                        data={orders}
                        globalFilterValue={globalFilter}
                        onGlobalFilterChange={setGlobalFilter}
                        onTableChange={setTable}
                    />
                </div>
            </MainPageLayout>

            <DeleteDialog
                open={!!deletingOrder}
                onOpenChange={(open) => !open && setDeletingOrder(null)}
                onConfirm={handleDelete}
                title="Delete Order"
                description={`Are you sure you want to delete order "${deletingOrder?.order_number}"? This action cannot be undone.`}
            />
        </>
    );
}
