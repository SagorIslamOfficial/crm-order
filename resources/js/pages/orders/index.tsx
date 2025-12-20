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
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface Order {
    id: string;
    order_number: string;
    customer: {
        id: string;
        name: string;
        phone: string;
    };
    shop: {
        id: string;
        name: string;
        code: string;
    };
    total_amount: string;
    advance_paid: string;
    due_amount: string;
    status: 'pending' | 'delivered' | 'cancelled';
    delivery_date: string;
    created_at: string;
}

interface OrdersPageProps extends PageProps {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Orders',
        href: '/orders',
    },
];

const statusColors = {
    pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    delivered:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function OrdersIndex({ orders }: OrdersPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Orders</CardTitle>
                            <CardDescription>
                                Manage your customer orders
                            </CardDescription>
                        </div>
                        <Link href="/orders/create">
                            <Button>
                                <Plus className="mr-2 size-4" />
                                New Order
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order #</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Shop</TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Paid
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Due
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Delivery</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            className="text-center text-muted-foreground"
                                        >
                                            No orders found. Create your first
                                            order to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.data.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="hover:underline"
                                                >
                                                    {order.order_number}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {order.customer.name}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {order.customer.phone}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {order.shop.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ৳{order.total_amount}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ৳{order.advance_paid}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ৳{order.due_amount}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        statusColors[
                                                            order.status
                                                        ]
                                                    }
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    order.delivery_date,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {orders.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {orders.data.length} of{' '}
                                    {orders.total} orders
                                </div>
                                <div className="flex gap-2">
                                    {orders.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveScroll
                                        >
                                            <Button
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
