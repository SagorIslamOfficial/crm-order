import {
    DataTableActions,
    DataTableColumnHeader,
    OrderStatusBadge,
    PriceDisplay,
} from '@/components/common';
import { edit as ordersEdit, show as ordersShow } from '@/routes/orders';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import type { Order } from './types';

interface UseOrderColumnsProps {
    onDelete: (order: Order) => void;
}

export function UseOrderColumns({
    onDelete,
}: UseOrderColumnsProps): ColumnDef<Order>[] {
    return [
        {
            accessorKey: 'order_number',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Order #" />
            ),
            cell: ({ row }) => (
                <span className="font-mono font-medium">
                    {row.getValue('order_number')}
                </span>
            ),
        },
        {
            accessorKey: 'customer',
            header: 'Customer',
            cell: ({ row }) => {
                const customer = row.getValue('customer') as { name: string };
                return <span>{customer?.name || '-'}</span>;
            },
        },
        {
            accessorKey: 'shop',
            header: 'Shop',
            cell: ({ row }) => {
                const shop = row.getValue('shop') as {
                    name: string;
                    code: string;
                };
                return (
                    <span className="text-muted-foreground">
                        {shop?.name || '-'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'total_amount',
            header: 'Total',
            cell: ({ row }) => (
                <PriceDisplay amount={row.getValue('total_amount')} />
            ),
        },
        {
            accessorKey: 'due_amount',
            header: 'Due',
            cell: ({ row }) => {
                const due = parseFloat(row.getValue('due_amount') || '0');
                return (
                    <span
                        className={due > 0 ? 'font-semibold text-red-600' : ''}
                    >
                        <PriceDisplay amount={row.getValue('due_amount')} />
                    </span>
                );
            },
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => (
                <OrderStatusBadge status={row.getValue('status')} />
            ),
        },
        {
            accessorKey: 'delivery_date',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Delivery" />
            ),
            cell: ({ row }) =>
                new Date(row.getValue('delivery_date')).toLocaleDateString(),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <DataTableActions
                        onView={() => router.visit(ordersShow(order.id).url)}
                        onEdit={() => router.visit(ordersEdit(order.id).url)}
                        onDelete={() => onDelete(order)}
                        showView={true}
                        viewPermission="orders.view"
                        editPermission="orders.edit"
                        deletePermission="orders.delete"
                    />
                );
            },
        },
    ];
}
