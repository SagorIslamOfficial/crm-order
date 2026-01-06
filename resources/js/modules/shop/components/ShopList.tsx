import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { create } from '@/routes/shops';
import { Link } from '@inertiajs/react';
import type { Shop } from '../types';

interface PaginationMeta {
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface ShopListProps {
    shops: Shop[];
    pagination?: PaginationMeta;
    onDelete?: (shop: Shop) => void;
    onPageChange?: (page: number) => void;
}

export function ShopList({
    shops,
    pagination,
    onDelete,
    onPageChange,
}: ShopListProps) {
    if (!shops || shops.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 text-muted-foreground">No shops found</div>
                <Link href={create().url}>
                    <Button>Create Shop</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold">Shops</h2>
                    <Badge variant="secondary">
                        {pagination?.total ?? shops.length}
                    </Badge>
                </div>
                <Link href={create().url}>
                    <Button>Create Shop</Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Website</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shops.map((shop) => (
                            <TableRow key={shop.id}>
                                <TableCell className="font-medium">
                                    {shop.code}
                                </TableCell>
                                <TableCell>{shop.name}</TableCell>
                                <TableCell className="max-w-xs truncate">
                                    {shop.address}
                                </TableCell>
                                <TableCell>{shop.phone}</TableCell>
                                <TableCell>
                                    {shop.website && (
                                        <a
                                            href={shop.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {shop.website}
                                        </a>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            shop.is_active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {shop.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link href={`/shops/${shop.id}`}>
                                            <Button variant="outline" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                        <Link href={`/shops/${shop.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                        {onDelete && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onDelete(shop)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {pagination.from} to {pagination.to} of{' '}
                        {pagination.total} results
                    </div>
                    <div className="flex items-center space-x-2">
                        {pagination.prev_page_url && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onPageChange?.(pagination.current_page - 1)
                                }
                            >
                                Previous
                            </Button>
                        )}
                        {pagination.next_page_url && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onPageChange?.(pagination.current_page + 1)
                                }
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
