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
import AppLayout from '@/layouts/app-layout';
import { edit } from '@/routes/customers';
import { show as showOrder } from '@/routes/orders';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';

interface Order {
    id: string;
    order_number: string;
    amount: string | null;
    status: string;
    created_at: string;
}

interface Customer {
    id: string;
    phone: string;
    name: string;
    address: string | null;
    created_at: string;
    orders: Order[];
}

interface Props extends PageProps {
    customer: Customer;
}

const getStatusBadge = (status: string) => {
    const statusMap: Record<
        string,
        {
            label: string;
            variant: 'default' | 'secondary' | 'outline' | 'destructive';
        }
    > = {
        pending: { label: 'Pending', variant: 'outline' },
        delivered: { label: 'Delivered', variant: 'default' },
        cancelled: { label: 'Cancelled', variant: 'destructive' },
    };

    const statusInfo = statusMap[status] || {
        label: status,
        variant: 'default',
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
};

export default function CustomersShow({ customer }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Customers',
            href: '/customers',
        },
        {
            title: customer.name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={customer.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {customer.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Customer details and order history
                        </p>
                    </div>
                    <Link href={edit(customer.id).url}>
                        <Button>Edit Customer</Button>
                    </Link>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Contact Information */}
                    <div className="rounded-lg border border-gray-200 p-6 dark:border-slate-700">
                        <h2 className="mb-4 text-lg font-semibold">
                            Contact Information
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Phone
                                </p>
                                <p className="font-mono font-semibold">
                                    {customer.phone}
                                </p>
                            </div>
                            {customer.address && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Address
                                    </p>
                                    <p className="whitespace-pre-line">
                                        {customer.address}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="rounded-lg border border-gray-200 p-6 dark:border-slate-700">
                        <h2 className="mb-4 text-lg font-semibold">
                            Account Information
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Joined
                                </p>
                                <p>
                                    {new Date(
                                        customer.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Orders
                                </p>
                                <p className="text-2xl font-bold">
                                    {customer.orders.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders */}
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
                    <div className="border-b border-gray-200 p-6 dark:border-slate-700">
                        <h2 className="text-lg font-semibold">Order History</h2>
                    </div>

                    {customer.orders.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-muted-foreground">
                                No orders yet
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100 dark:bg-slate-800">
                                    <TableHead>Order Number</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customer.orders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className="hover:bg-gray-50 dark:hover:bg-slate-800"
                                    >
                                        <TableCell className="font-mono font-semibold">
                                            {order.order_number}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            ৳{order.amount || '0.00'}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(order.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href={showOrder(order.id).url}
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    title="View Order"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
