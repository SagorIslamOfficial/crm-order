import { InfoCard, PriceDisplay } from '@/components/common';
import type { Order } from '@/components/modules/order/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface ItemsViewProps {
    order: Order;
    className?: string;
}

export function ItemsView({ order, className }: ItemsViewProps) {
    if (!order.items || order.items.length === 0) {
        return (
            <div className={className}>
                <InfoCard title="Order Items">
                    <div className="py-8 text-center text-muted-foreground">
                        No items in this order
                    </div>
                </InfoCard>
            </div>
        );
    }

    return (
        <div className={className}>
            <InfoCard title="Order Items">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Type</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">
                                Quantity
                            </TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.product_type.name}
                                </TableCell>
                                <TableCell>
                                    {item.product_size.size_label}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.quantity}
                                </TableCell>
                                <TableCell className="text-right">
                                    <PriceDisplay
                                        amount={parseFloat(item.price)}
                                    />
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    <PriceDisplay
                                        amount={parseFloat(item.line_total)}
                                    />
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {item.notes || '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                        {/* Subtotal Row */}
                        <TableRow className="border-t-2">
                            <TableCell
                                colSpan={4}
                                className="text-right font-medium"
                            >
                                Subtotal:
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                <PriceDisplay
                                    amount={order.items.reduce(
                                        (sum, item) =>
                                            sum + parseFloat(item.line_total),
                                        0,
                                    )}
                                />
                            </TableCell>
                            <TableCell />
                        </TableRow>

                        {/* Discount Row */}
                        {(() => {
                            const subtotal = order.items.reduce(
                                (sum, item) =>
                                    sum + parseFloat(item.line_total),
                                0,
                            );
                            const total = parseFloat(order.total_amount);
                            const discountValue = subtotal - total;

                            if (discountValue <= 0) return null;

                            // Calculate percentage from actual values
                            const discountPercentage =
                                subtotal > 0
                                    ? (
                                          (discountValue / subtotal) *
                                          100
                                      ).toFixed(0)
                                    : 0;

                            return (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-right text-orange-600"
                                    >
                                        Discount
                                        {order.discount_type === 'percentage' &&
                                            ` (${discountPercentage}%)`}
                                        :
                                    </TableCell>
                                    <TableCell className="text-right text-orange-600">
                                        -
                                        <PriceDisplay amount={discountValue} />
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            );
                        })()}

                        {/* Total Row */}
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-right font-bold"
                            >
                                Total:
                            </TableCell>
                            <TableCell className="text-right font-bold">
                                <PriceDisplay
                                    amount={parseFloat(order.total_amount)}
                                />
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    </TableBody>
                </Table>
            </InfoCard>
        </div>
    );
}
