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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { create, destroy, edit, index, show } from '@/routes/customers';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: string;
    phone: string;
    name: string;
    address: string | null;
    created_at: string;
}

interface PaginationData {
    current_page: number;
    data: Customer[];
    first_page_url: string | null;
    from: number;
    last_page: number;
    last_page_url: string | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface Props extends PageProps {
    customers: PaginationData;
    search: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: '/customers',
    },
];

export default function CustomersIndex({ customers, search }: Props) {
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchValue, setSearchValue] = useState(search || '');

    const handleDelete = (id: string) => {
        setSelectedCustomerId(id);
    };

    const confirmDelete = async () => {
        if (!selectedCustomerId) return;

        setIsDeleting(true);
        router.delete(destroy(selectedCustomerId).url, {
            onFinish: () => {
                setIsDeleting(false);
                setSelectedCustomerId(null);
            },
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            index({ query: { search: searchValue || undefined } }).url,
            {},
            { preserveState: true },
        );
    };

    const handleClearSearch = () => {
        setSearchValue('');
        router.get(index().url, {}, { preserveState: true });
    };

    const goToPage = (pageNumber: number) => {
        router.get(
            index({
                query: { page: pageNumber, search: searchValue || undefined },
            }).url,
            {},
            { preserveState: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Customers
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and view all your customers
                        </p>
                    </div>

                    {/* Add Button */}
                    <Link href={create().url}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Customer
                        </Button>
                    </Link>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Search by phone or name..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit">Search</Button>
                    {searchValue && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClearSearch}
                        >
                            Clear
                        </Button>
                    )}
                </form>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
                    {customers.data.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-muted-foreground">
                                {searchValue
                                    ? 'No customers found matching your search.'
                                    : 'No customers yet. Create one to get started.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-100 dark:bg-slate-800">
                                        <TableHead>Date Created</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.data.map((customer) => (
                                        <TableRow
                                            key={customer.id}
                                            className="hover:bg-gray-50 dark:hover:bg-slate-800"
                                        >
                                            <TableCell>
                                                {new Date(
                                                    customer.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="font-mono">
                                                {customer.phone}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {customer.name}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {customer.address || '—'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={
                                                            show(customer.id)
                                                                .url
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
                                                            edit(customer.id)
                                                                .url
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
                                                                customer.id,
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

                            {/* Pagination */}
                            <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-slate-700">
                                <p className="text-sm text-muted-foreground">
                                    Showing {customers.from} to {customers.to}{' '}
                                    of {customers.total} customers
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={!customers.prev_page_url}
                                        onClick={() =>
                                            goToPage(customers.current_page - 1)
                                        }
                                        className="gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>

                                    {customers.links.map((link, index) => {
                                        if (
                                            link.label.includes('Previous') ||
                                            link.label.includes('Next')
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <Button
                                                key={index}
                                                size="sm"
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                onClick={() => {
                                                    const pageNumber = parseInt(
                                                        link.label,
                                                    );
                                                    if (!isNaN(pageNumber)) {
                                                        goToPage(pageNumber);
                                                    }
                                                }}
                                                disabled={!link.url}
                                            >
                                                {link.label}
                                            </Button>
                                        );
                                    })}

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={!customers.next_page_url}
                                        onClick={() =>
                                            goToPage(customers.current_page + 1)
                                        }
                                        className="gap-1"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!selectedCustomerId}
                onOpenChange={() => setSelectedCustomerId(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Customer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this customer? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedCustomerId(null)}
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
