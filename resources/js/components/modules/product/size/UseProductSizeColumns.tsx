import { DataTableActions, DataTableColumnHeader } from '@/components/common';
import type { ProductSize } from '@/components/modules/product/size/types/Product.types';
import {
    edit as productSizesEdit,
    show as productSizesShow,
} from '@/routes/product-sizes';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

interface UseProductSizeColumnsProps {
    onDelete: (productSize: ProductSize) => void;
}

export function UseProductSizeColumns({
    onDelete,
}: UseProductSizeColumnsProps): ColumnDef<ProductSize>[] {
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
            accessorKey: 'product_type',
            header: 'Product Type',
            cell: ({ row }) => {
                const productType = row.getValue('product_type') as {
                    name: string;
                };
                return (
                    <span className="text-muted-foreground">
                        {productType?.name || '-'}
                    </span>
                );
            },
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
                const productSize = row.original;
                return (
                    <DataTableActions
                        onView={() =>
                            router.visit(productSizesShow(productSize.id).url)
                        }
                        onEdit={() =>
                            router.visit(productSizesEdit(productSize.id).url)
                        }
                        onDelete={() => onDelete(productSize)}
                        showView={true}
                        viewPermission="product-sizes.view"
                        editPermission="product-sizes.edit"
                        deletePermission="product-sizes.delete"
                    />
                );
            },
        },
    ];
}
