import {
    InfoCard,
    OrderStatusBadge,
    PriceDisplay,
    formatDateForDisplay,
} from '@/components/common';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { show as ordersShow } from '@/routes/orders';
import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';

import type { PaginatedOrders } from '../types';

interface OrdersViewProps {
    orders: PaginatedOrders;
}

export function OrdersView({ orders }: OrdersViewProps) {
    if (orders.data.length === 0) {
        return (
            <InfoCard
                title="Order History"
                description="No orders found for this customer"
            >
                <div className="py-8 text-center text-muted-foreground">
                    <p>This customer hasn't placed any orders yet.</p>
                </div>
            </InfoCard>
        );
    }

    return (
        <InfoCard
            title="Order History"
            description={`${orders.total} order(s) recorded`}
            className="mb-6"
        >
            <div className="overflow-x-auto">
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
                                    {formatDateForDisplay(order.created_at)}
                                </TableCell>
                                <TableCell>
                                    <PriceDisplay
                                        amount={Number(order.total_amount)}
                                        currency="BDT"
                                        size="sm"
                                    />
                                </TableCell>
                                <TableCell>
                                    <OrderStatusBadge
                                        status={order.status}
                                        showIcon
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        asChild
                                    >
                                        <Link href={ordersShow(order.id).url}>
                                            <Eye className="mr-1 size-4" />
                                            View
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </InfoCard>
    );
}
