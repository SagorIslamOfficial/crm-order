import { DataTableActions, DataTableColumnHeader } from '@/components/common';
import {
    edit as productTypesEdit,
    show as productTypesShow,
} from '@/routes/product-types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import type { ProductType } from './types/Product.types';

interface UseProductTypeColumnsProps {
    onDelete: (productType: ProductType) => void;
}

export function UseProductTypeColumns({
    onDelete,
}: UseProductTypeColumnsProps): ColumnDef<ProductType>[] {
    return [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue('name')}</span>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => {
                const description = String(row.getValue('description') || '');
                const words = description.split(/\s+/);
                const truncated =
                    words.length > 10
                        ? words.slice(0, 10).join(' ') + '...'
                        : description;

                return (
                    <span
                        className="block max-w-[300px] truncate text-muted-foreground"
                        title={description}
                    >
                        {description ? truncated : '-'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'sizes_count',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Sizes" />
            ),
            cell: ({ row }) => row.getValue('sizes_count') || 0,
        },
        {
            accessorKey: 'orders_count',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Orders" />
            ),
            cell: ({ row }) => row.getValue('orders_count') || 0,
        },
        {
            accessorKey: 'is_active',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => (
                <span
                    className={
                        row.getValue('is_active')
                            ? 'text-green-600'
                            : 'text-gray-400'
                    }
                >
                    {row.getValue('is_active') ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const productType = row.original;
                return (
                    <DataTableActions
                        onView={() =>
                            router.visit(productTypesShow(productType.id).url)
                        }
                        onEdit={() =>
                            router.visit(productTypesEdit(productType.id).url)
                        }
                        onDelete={() => onDelete(productType)}
                        showView={true}
                        viewPermission="product-types.view"
                        editPermission="product-types.edit"
                        deletePermission="product-types.delete"
                    />
                );
            },
        },
    ];
}
