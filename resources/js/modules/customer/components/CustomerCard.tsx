import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatPhone } from '@/shared/utils';
import type { Customer } from '../types';

interface CustomerCardProps {
    customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{customer.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Phone
                        </label>
                        <p className="text-sm">{formatPhone(customer.phone)}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Created
                        </label>
                        <p className="text-sm">
                            {formatDate(customer.created_at)}
                        </p>
                    </div>
                </div>

                {customer.address && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Address
                        </label>
                        <p className="text-sm">{customer.address}</p>
                    </div>
                )}

                {customer.orders && customer.orders.length > 0 && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Recent Orders
                        </label>
                        <div className="mt-2 space-y-2">
                            {customer.orders.slice(0, 3).map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between rounded bg-muted p-2"
                                >
                                    <span className="text-sm font-medium">
                                        {order.order_number}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        ${order.amount} - {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
