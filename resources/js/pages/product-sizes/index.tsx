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
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { create, destroy, edit, index, show } from '@/routes/product-sizes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface ProductType {
    id: string;
    name: string;
}

interface ProductSize {
    id: string;
    size_label: string;
    is_active: boolean;
    product_type: ProductType;
    orders_count: number;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    data: ProductSize[];
}

interface PaginatedProductSizes extends PaginationMeta {}

interface Props {
    productSizes: PaginatedProductSizes;
    productTypes: ProductType[];
    search?: string;
    productTypeId?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Sizes',
        href: '/product-sizes',
    },
];

export default function ProductSizesIndex({
    productSizes,
    productTypes,
    search,
    productTypeId,
}: Props) {
    const [selectedProductSizeId, setSelectedProductSizeId] = useState<
        string | null
    >(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchValue, setSearchValue] = useState(search || '');
    const [selectedProductType, setSelectedProductType] = useState(
        productTypeId || 'all',
    );

    const { data: productSizesData, current_page, last_page } = productSizes;

    const handleDelete = (id: string) => {
        setSelectedProductSizeId(id);
    };

    const confirmDelete = async () => {
        if (!selectedProductSizeId) return;

        setIsDeleting(true);
        router.delete(destroy(selectedProductSizeId).url, {
            onFinish: () => {
                setIsDeleting(false);
                setSelectedProductSizeId(null);
            },
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            index({
                query: {
                    search: searchValue || undefined,
                    product_type_id:
                        selectedProductType === 'all'
                            ? undefined
                            : selectedProductType || undefined,
                    page: 1, // Reset to first page when searching
                },
            }).url,
            {},
            { preserveState: true },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            index({
                query: {
                    search: searchValue || undefined,
                    product_type_id:
                        selectedProductType === 'all'
                            ? undefined
                            : selectedProductType || undefined,
                    page,
                },
            }).url,
            {},
            { preserveState: true },
        );
    };

    const handleClearSearch = () => {
        setSearchValue('');
        setSelectedProductType('all');
        router.get(index().url, {}, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Sizes" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Product Sizes
                        </h1>
                        <p className="text-muted-foreground">
                            Manage product sizes for different product types
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Product Size
                        </Button>
                    </Link>
                </div>

                {/* Search and Filter */}
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search product sizes..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <Select
                        value={selectedProductType}
                        onValueChange={setSelectedProductType}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by product type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All Product Types
                            </SelectItem>
                            {productTypes.map((productType) => (
                                <SelectItem
                                    key={productType.id}
                                    value={productType.id}
                                >
                                    {productType.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="submit" variant="outline" className="gap-2">
                        <Search className="h-4 w-4" />
                        Search
                    </Button>
                    {(searchValue ||
                        (selectedProductType &&
                            selectedProductType !== 'all')) && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClearSearch}
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </form>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
                    {productSizesData.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-muted-foreground">
                                {searchValue ||
                                (selectedProductType &&
                                    selectedProductType !== 'all')
                                    ? 'No product sizes found matching your search.'
                                    : 'No product sizes yet. Create one to get started.'}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100 dark:bg-slate-800">
                                    <TableHead>Size Label</TableHead>
                                    <TableHead>Product Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Orders</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productSizesData.map((productSize) => (
                                    <TableRow
                                        key={productSize.id}
                                        className="hover:bg-gray-50 dark:hover:bg-slate-800"
                                    >
                                        <TableCell className="font-medium">
                                            {productSize.size_label}
                                        </TableCell>
                                        <TableCell>
                                            {productSize.product_type.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    productSize.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {productSize.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {productSize.orders_count} orders
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={
                                                        show(productSize.id).url
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
                                                        edit(productSize.id).url
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
                                                            productSize.id,
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

                {/* Pagination */}
                {last_page > 1 && (
                    <Pagination
                        currentPage={current_page}
                        lastPage={last_page}
                        onPageChange={handlePageChange}
                        className="mt-4"
                    />
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!selectedProductSizeId}
                onOpenChange={() => setSelectedProductSizeId(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Product Size</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this product size?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedProductSizeId(null)}
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
