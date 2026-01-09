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
import type { ProductType } from '../types';

interface ProductTypeListProps {
    productTypes: ProductType[];
    loading?: boolean;
    onDelete?: (productType: ProductType) => void;
}

export function ProductTypeList({
    productTypes,
    loading,
    onDelete,
}: ProductTypeListProps) {
    if (loading) {
        return (
            <div className="flex h-32 items-center justify-center">
                <div className="text-muted-foreground">
                    Loading product types...
                </div>
            </div>
        );
    }

    if (productTypes.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center">
                <div className="text-muted-foreground">
                    No product types found
                </div>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {productTypes.map((productType) => (
                    <TableRow key={productType.id}>
                        <TableCell className="font-medium">
                            {productType.name}
                        </TableCell>
                        <TableCell>{productType.description || '-'}</TableCell>
                        <TableCell>
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                    productType.is_active
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                }`}
                            >
                                {productType.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </TableCell>
                        <TableCell>
                            {new Date(
                                productType.created_at,
                            ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Link href={`/product-types/${productType.id}`}>
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link
                                    href={`/product-types/${productType.id}/edit`}
                                >
                                    <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                {onDelete && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(productType)}
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
