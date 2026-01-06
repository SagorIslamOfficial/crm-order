import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderService } from '../services';
import type { Order } from '../types';

interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="font-mono">
                        {order.order_number}
                    </CardTitle>
                    <Badge
                        className={OrderService.getStatusColor(order.status)}
                    >
                        {OrderService.getStatusLabel(order.status)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Customer
                        </label>
                        <p className="text-sm font-medium">
                            {order.customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {order.customer.phone}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Shop
                        </label>
                        <p className="text-sm font-medium">{order.shop.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {order.shop.code}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Delivery Date
                        </label>
                        <p className="text-sm">
                            {OrderService.formatDate(order.delivery_date)}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Total Amount
                        </label>
                        <p className="text-sm font-medium">
                            {OrderService.formatCurrency(order.total_amount)}
                        </p>
                    </div>
                </div>

                {order.delivery_address && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Delivery Address
                        </label>
                        <p className="text-sm">{order.delivery_address}</p>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-4 border-t pt-2">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            Advance Paid
                        </p>
                        <p className="text-sm font-medium">
                            {OrderService.formatCurrency(order.advance_paid)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            Due Amount
                        </p>
                        <p className="text-sm font-medium">
                            {OrderService.formatCurrency(order.due_amount)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-sm font-medium">
                            {OrderService.formatDate(order.created_at)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
