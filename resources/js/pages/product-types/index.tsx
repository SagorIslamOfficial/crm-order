import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { create, destroy, edit, show } from '@/routes/product-types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductType {
    id: string;
    name: string;
    is_active: boolean;
    sizes: Array<{
        id: string;
        size_label: string;
        is_active: boolean;
    }>;
    sizes_count: number;
    orders_count: number;
}

interface Props {
    productTypes: ProductType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Types',
        href: '/product-types',
    },
];

export default function ProductTypesIndex({ productTypes }: Props) {
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<
        string | null
    >(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (id: string) => {
        setSelectedProductTypeId(id);
    };

    const confirmDelete = async () => {
        if (!selectedProductTypeId) return;

        setIsDeleting(true);
        router.delete(destroy(selectedProductTypeId).url, {
            onFinish: () => {
                setIsDeleting(false);
                setSelectedProductTypeId(null);
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Types" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Product Types
                        </h1>
                        <p className="text-muted-foreground">
                            Manage product types and their sizes
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Product Type
                        </Button>
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
                    {productTypes.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-muted-foreground">
                                No product types found.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100 dark:bg-slate-800">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Sizes</TableHead>
                                    <TableHead>Orders</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productTypes.map((productType) => (
                                    <TableRow
                                        key={productType.id}
                                        className="hover:bg-gray-50 dark:hover:bg-slate-800"
                                    >
                                        <TableCell className="font-medium">
                                            {productType.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    productType.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {productType.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {productType.sizes_count} sizes
                                        </TableCell>
                                        <TableCell>
                                            {productType.orders_count} orders
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={
                                                        show(productType.id).url
                                                    }
                                                    title="View"
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-blue-600 dark:text-blue-400"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={
                                                        edit(productType.id).url
                                                    }
                                                    title="Edit"
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-yellow-600 dark:text-yellow-400"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-600 dark:text-red-400"
                                                    onClick={() =>
                                                        handleDelete(
                                                            productType.id,
                                                        )
                                                    }
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!selectedProductTypeId}
                onOpenChange={() => setSelectedProductTypeId(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Product Type</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this product type?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedProductTypeId(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
