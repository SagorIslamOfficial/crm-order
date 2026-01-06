import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { show as ordersShow } from '@/routes/orders';
import type { PaginatedOrders } from '../types';

const statusColors: Record<string, string> = {
    pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    delivered:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

interface OrderHistoryTableProps {
    orders: PaginatedOrders;
}

export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
    if (orders.data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>No orders yet</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-8 text-center text-muted-foreground">
                        No orders yet
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                    {orders.total} order(s) recorded
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order Number</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono font-semibold">
                                    {order.order_number}
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        order.created_at,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </TableCell>
                                <TableCell className="font-semibold">
                                    ৳
                                    {order.total_amount
                                        ? parseFloat(
                                              order.total_amount,
                                          ).toLocaleString()
                                        : '0'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            statusColors[order.status] ||
                                            'bg-gray-100 text-gray-800'
                                        }
                                    >
                                        {order.status.charAt(0).toUpperCase() +
                                            order.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link
                                        href={ordersShow(order.id).url}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        View
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <p className="text-sm text-muted-foreground">
                            Showing {orders.from} to {orders.to} of{' '}
                            {orders.total} orders
                        </p>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={!orders.prev_page_url}
                                asChild={!!orders.prev_page_url}
                            >
                                {orders.prev_page_url ? (
                                    <Link href={orders.prev_page_url}>
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Link>
                                ) : (
                                    <>
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </>
                                )}
                            </Button>

                            {orders.links.map((link, index) => {
                                if (
                                    link.label.includes('Previous') ||
                                    link.label.includes('Next')
                                ) {
                                    return null;
                                }

                                if (link.label.includes('...')) {
                                    return (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            disabled
                                        >
                                            ...
                                        </Button>
                                    );
                                }

                                return (
                                    <Button
                                        key={index}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        asChild={!!link.url}
                                    >
                                        {link.url ? (
                                            <Link href={link.url}>
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <span>{link.label}</span>
                                        )}
                                    </Button>
                                );
                            })}

                            <Button
                                size="sm"
                                variant="outline"
                                disabled={!orders.next_page_url}
                                asChild={!!orders.next_page_url}
                            >
                                {orders.next_page_url ? (
                                    <Link href={orders.next_page_url}>
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <>
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
