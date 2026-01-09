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
import type { OrderItem } from '../types';

interface OrderItemsTableProps {
    items: OrderItem[];
    showPricing?: boolean;
}

export function OrderItemsTable({
    items,
    showPricing = true,
}: OrderItemsTableProps) {
    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                    {items.length} item(s) in this order
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">
                                Quantity
                            </TableHead>
                            {showPricing && (
                                <>
                                    <TableHead className="text-right">
                                        Price
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Subtotal
                                    </TableHead>
                                </>
                            )}
                            <TableHead>Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
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
                                {showPricing && (
                                    <>
                                        <TableCell className="text-right">
                                            ৳{item.price}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ৳{item.line_total}
                                        </TableCell>
                                    </>
                                )}
                                <TableCell className="text-muted-foreground">
                                    {item.notes || '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
