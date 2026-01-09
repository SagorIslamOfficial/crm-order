import { DataTableColumnHeader } from '@/components/common';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import type { ProductSize } from '../types/Product.types';

export function useSizeColumns(): ColumnDef<ProductSize>[] {
    return [
        {
            accessorKey: 'size_label',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Size Label" />
            ),
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.getValue('size_label')}
                </span>
            ),
        },
        {
            accessorKey: 'is_active',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const isActive = row.getValue('is_active');
                return (
                    <StatusBadge variant={isActive ? 'success' : 'secondary'}>
                        {isActive ? 'Active' : 'Inactive'}
                    </StatusBadge>
                );
            },
        },
    ];
}
