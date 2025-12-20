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
import { create, destroy, edit, index, show } from '@/routes/shops';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface Shop {
    id: string;
    code: string;
    name: string;
    address: string;
    phone: string;
    website: string | null;
    is_active: boolean;
    orders_count: number;
    next_order_sequence: number;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    data: Shop[];
}

interface Props {
    shops: PaginationMeta;
    search?: string;
    isActive?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shops',
        href: '/shops',
    },
];

export default function ShopsIndex({ shops, search, isActive }: Props) {
    const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchValue, setSearchValue] = useState(search || '');
    const [statusFilter, setStatusFilter] = useState(isActive || 'all');

    const { data: shopsData, current_page, last_page } = shops;

    const handleDelete = (id: string) => {
        setSelectedShopId(id);
    };

    const confirmDelete = async () => {
        if (!selectedShopId) return;

        setIsDeleting(true);
        router.delete(destroy(selectedShopId).url, {
            onFinish: () => {
                setIsDeleting(false);
                setSelectedShopId(null);
            },
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            index({
                query: {
                    search: searchValue || undefined,
                    is_active:
                        statusFilter === 'all' ? undefined : statusFilter,
                    page: 1,
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
                    is_active:
                        statusFilter === 'all' ? undefined : statusFilter,
                    page,
                },
            }).url,
            {},
            { preserveState: true },
        );
    };

    const handleClearSearch = () => {
        setSearchValue('');
        setStatusFilter('all');
        router.get(index().url, {}, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shops" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Shops
                        </h1>
                        <p className="text-muted-foreground">
                            Manage shop locations and information
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Shop
                        </Button>
                    </Link>
                </div>

                {/* Search and Filter */}
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search shops by name, code, address or phone..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="0">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit" variant="outline" className="gap-2">
                        <Search className="h-4 w-4" />
                        Search
                    </Button>
                    {(searchValue ||
                        (statusFilter && statusFilter !== 'all')) && (
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
                    {shopsData.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-muted-foreground">
                                {searchValue ||
                                (statusFilter && statusFilter !== 'all')
                                    ? 'No shops found matching your search.'
                                    : 'No shops yet. Create one to get started.'}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100 dark:bg-slate-800">
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Orders</TableHead>
                                    <TableHead>Next Order #</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shopsData.map((shop) => (
                                    <TableRow key={shop.id}>
                                        <TableCell className="font-medium">
                                            {shop.code}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {shop.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {shop.address.length > 60
                                                        ? `${shop.address.substring(0, 60)}...`
                                                        : shop.address}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{shop.phone}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    shop.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {shop.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {shop.orders_count}
                                        </TableCell>
                                        <TableCell>
                                            {String(
                                                shop.next_order_sequence,
                                            ).padStart(6, '0')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={show(shop.id).url}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={edit(shop.id).url}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Edit Shop"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDelete(shop.id)
                                                    }
                                                    title="Delete Shop"
                                                    disabled={
                                                        shop.orders_count > 0
                                                    }
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
                    />
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={selectedShopId !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedShopId(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this shop? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedShopId(null)}
                            disabled={isDeleting}
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
