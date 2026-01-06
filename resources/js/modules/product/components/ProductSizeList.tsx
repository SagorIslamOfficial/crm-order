import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import type { ProductSize } from '../types';

interface ProductSizeListProps {
    productSizes: ProductSize[];
    loading?: boolean;
    onDelete?: (productSize: ProductSize) => void;
}

export function ProductSizeList({
    productSizes,
    loading,
    onDelete,
}: ProductSizeListProps) {
    if (loading) {
        return (
            <div className="flex h-32 items-center justify-center">
                <div className="text-muted-foreground">
                    Loading product sizes...
                </div>
            </div>
        );
    }

    if (productSizes.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center">
                <div className="text-muted-foreground">
                    No product sizes found
                </div>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Size Label</TableHead>
                    <TableHead>Product Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {productSizes.map((productSize) => (
                    <TableRow key={productSize.id}>
                        <TableCell className="font-medium">
                            {productSize.size_label}
                        </TableCell>
                        <TableCell>
                            {productSize.product_type?.name || '-'}
                        </TableCell>
                        <TableCell>${parseFloat(productSize.price).toFixed(2)}</TableCell>
                        <TableCell>{productSize.description || '-'}</TableCell>
                        <TableCell>
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                    productSize.is_active
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                }`}
                            >
                                {productSize.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </TableCell>
                        <TableCell>
                            {new Date(
                                productSize.created_at,
                            ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Link href={`/product-sizes/${productSize.id}`}>
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link
                                    href={`/product-sizes/${productSize.id}/edit`}
                                >
                                    <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                {onDelete && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(productSize)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
