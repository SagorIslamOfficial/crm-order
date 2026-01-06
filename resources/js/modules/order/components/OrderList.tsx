import {
    ActionButton,
    DataTable,
    DataTableColumn,
    EmptyState,
    StatusBadge,
} from '@/shared/components';
import { Edit, Eye, Package, Trash2 } from 'lucide-react';
import { OrderService } from '../services';
import type { Order } from '../types';

interface OrderListProps {
    orders: Order[];
    loading?: boolean;
    onDelete?: (order: Order) => void;
}

export function OrderList({ orders, loading, onDelete }: OrderListProps) {
    const columns: DataTableColumn<Order>[] = [
        {
            key: 'order_number',
            header: 'Order #',
            sortable: true,
            cell: (order) => (
                <span className="font-mono font-medium">
                    {order.order_number}
                </span>
            ),
        },
        {
            key: 'customer',
            header: 'Customer',
            sortable: true,
            sortKey: 'customer.name',
            cell: (order) => (
                <div>
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                        {order.customer.phone}
                    </div>
                </div>
            ),
        },
        {
            key: 'shop',
            header: 'Shop',
            cell: (order) => (
                <div>
                    <div className="font-medium">{order.shop.name}</div>
                    <div className="text-sm text-muted-foreground">
                        {order.shop.code}
                    </div>
                </div>
            ),
        },
        {
            key: 'delivery_date',
            header: 'Delivery Date',
            sortable: true,
            cell: (order) => OrderService.formatDate(order.delivery_date),
        },
        {
            key: 'total_amount',
            header: 'Total Amount',
            sortable: true,
            cellClassName: 'font-medium',
            cell: (order) => OrderService.formatCurrency(order.total_amount),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            cell: (order) => (
                <StatusBadge variant={order.status}>
                    {OrderService.getStatusLabel(order.status)}
                </StatusBadge>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            headerClassName: 'text-right',
            cellClassName: 'text-right',
            cell: (order) => (
                <div className="flex justify-end gap-2">
                    <ActionButton
                        icon={Eye}
                        href={`/orders/${order.id}`}
                        permission="orders.view"
                        title="View order"
                        className="text-blue-600 dark:text-blue-400"
                    />
                    <ActionButton
                        icon={Edit}
                        href={`/orders/${order.id}/edit`}
                        permission="orders.edit"
                        title="Edit order"
                        className="text-yellow-600 dark:text-yellow-400"
                    />
                    {onDelete && (
                        <ActionButton
                            icon={Trash2}
                            onClick={() => onDelete(order)}
                            permission="orders.delete"
                            title="Delete order"
                            className="text-red-600 dark:text-red-400"
                        />
                    )}
                </div>
            ),
        },
    ];

    return (
        <DataTable
            data={orders}
            columns={columns}
            loading={loading}
            emptyState={
                <EmptyState
                    icon={Package}
                    title="No orders found"
                    description="Create your first order to get started"
                />
            }
        />
    );
}
