import { DataTableActions, DataTableColumnHeader } from '@/components/common';
import {
    edit as customersEdit,
    show as customersShow,
} from '@/routes/customers';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import type { Customer } from './types';

interface UseCustomerColumnsProps {
    onDelete: (customer: Customer) => void;
}

export function UseCustomerColumns({
    onDelete,
}: UseCustomerColumnsProps): ColumnDef<Customer>[] {
    return [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Customer Name" />
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.original.name}</div>
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
            cell: ({ row }) => (
                <div className="font-mono text-sm">{row.original.phone}</div>
            ),
        },
        {
            accessorKey: 'address',
            header: 'Address',
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {row.original.address || '-'}
                </div>
            ),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Member Since" />
            ),
            cell: ({ row }) => (
                <div className="text-sm">
                    {new Date(row.original.created_at).toLocaleDateString()}
                </div>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <DataTableActions
                    onEdit={() =>
                        router.get(customersEdit(row.original.id).url)
                    }
                    onView={() =>
                        router.get(customersShow(row.original.id).url)
                    }
                    onDelete={() => onDelete(row.original)}
                    showView={true}
                    viewPermission="customers.view"
                    editPermission="customers.edit"
                    deletePermission="customers.delete"
                />
            ),
        },
    ];
}
