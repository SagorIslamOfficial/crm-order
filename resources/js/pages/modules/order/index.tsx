import { Button } from '@/components/ui/button';
import type { Order, OrderIndexProps } from '@/modules/order/types';
import {
    create as ordersCreate,
    destroy as ordersDestroy,
    edit as ordersEdit,
    index as ordersIndex,
    show as ordersShow,
} from '@/routes/orders';
import {
    ActionButton,
    ConfirmDialog,
    DataTable,
    MainPageLayout,
    StatusBadge,
    useDeleteDialog,
} from '@/shared/components';
import { useInertiaProps } from '@/shared/hooks/UseInertiaProps';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, Plus, Trash2 } from 'lucide-react';
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

    const deleteDialog = useDeleteDialog<Order>({
        getItemName: (order) => order.order_number,
        onDelete: (order) => {
            router.delete(ordersDestroy(order.id).url, {
                onSuccess: () => {},
            });
        },
    });

    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: 'order_number',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="-ml-3"
                >
                    Order #
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-mono font-medium">
                    {row.getValue('order_number')}
                </span>
            ),
        },
        {
            accessorKey: 'customer.name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="-ml-3"
                >
                    Customer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {order.customer.phone}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'shop.name',
            header: 'Shop',
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div>
                        <div className="font-medium">{order.shop.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {order.shop.code}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'delivery_date',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="-ml-3"
                >
                    Delivery Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) =>
                new Date(row.getValue('delivery_date')).toLocaleDateString(),
        },
        {
            accessorKey: 'total_amount',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="-ml-3"
                >
                    Total Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) =>
                `৳${parseFloat(row.getValue('total_amount')).toLocaleString()}`,
        },
        {
            accessorKey: 'due_amount',
            header: 'Due',
            cell: ({ row }) =>
                `৳${parseFloat(row.getValue('due_amount')).toLocaleString()}`,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <StatusBadge variant={order.status}>
                        {order.status}
                    </StatusBadge>
                );
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div className="flex justify-end gap-2">
                        <ActionButton
                            icon={Eye}
                            href={ordersShow(order.id).url}
                            title="View order"
                        />
                        <ActionButton
                            icon={Edit}
                            href={ordersEdit(order.id).url}
                            title="Edit order"
                        />
                        <ActionButton
                            icon={Trash2}
                            onClick={() => deleteDialog.show(order)}
                            title="Delete order"
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <MainPageLayout
            title="Orders"
            description="Manage your customer orders"
            breadcrumbs={breadcrumbs}
            useCard={false}
            search={{
                value: globalFilter,
                placeholder: 'Search by order #, customer, or phone...',
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
                permission: 'orders.create',
            }}
        >
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={orders.data}
                    globalFilterValue={globalFilter}
                    pagination={{
                        current_page: orders.current_page,
                        last_page: orders.last_page,
                        total: orders.total,
                        per_page: orders.per_page,
                        links: orders.links,
                    }}
                    onPageChange={(url) => router.visit(url)}
                />
            </div>

            <ConfirmDialog
                {...deleteDialog.dialogProps}
                title="Delete Order"
                description={`Are you sure you want to delete order "${deleteDialog.itemName}"? This action cannot be undone.`}
            />
        </MainPageLayout>
    );
}
