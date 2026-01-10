import {
    DataTableActions,
    DataTableColumnHeader,
    StatusBadge,
} from '@/components/common';
import { edit as shopsEdit, show as shopsShow } from '@/routes/shops';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import type { Shop } from './types/Shop.types';

interface UseShopColumnsProps {
    onDelete: (shop: Shop) => void;
}

export function UseShopColumns({
    onDelete,
}: UseShopColumnsProps): ColumnDef<Shop>[] {
    return [
        {
            accessorKey: 'code',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Code" />
            ),
            cell: ({ row }) => (
                <span className="font-mono font-medium">
                    {row.getValue('code')}
                </span>
            ),
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Shop Name" />
            ),
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue('name')}</span>
            ),
        },
        {
            accessorKey: 'address',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Address"
                    sortable={false}
                />
            ),
            cell: ({ row }) => (
                <span className="line-clamp-1 text-muted-foreground">
                    {row.getValue('address')}
                </span>
            ),
        },
        {
            accessorKey: 'phone',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Phone"
                    sortable={false}
                />
            ),
            cell: ({ row }) => row.getValue('phone'),
        },
        {
            accessorKey: 'orders_count',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Orders" />
            ),
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.getValue('orders_count') || 0}
                </span>
            ),
        },
        {
            accessorKey: 'is_active',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => (
                <StatusBadge
                    variant={row.getValue('is_active') ? 'active' : 'inactive'}
                >
                    {row.getValue('is_active') ? 'Active' : 'Inactive'}
                </StatusBadge>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const shop = row.original;
                return (
                    <DataTableActions
                        onView={() => router.visit(shopsShow(shop.id).url)}
                        onEdit={() => router.visit(shopsEdit(shop.id).url)}
                        onDelete={() => onDelete(shop)}
                        showView={true}
                        viewPermission="shops.view"
                        editPermission="shops.edit"
                        deletePermission="shops.delete"
                    />
                );
            },
        },
    ];
}
