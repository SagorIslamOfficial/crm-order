import { Badge } from '@/components/ui/badge';
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
import type { ProductType } from '../types';

interface ProductTypeHistoryTableProps {
    productType: ProductType;
}

export function ProductTypeHistoryTable({
    productType,
}: ProductTypeHistoryTableProps) {
    if (!productType.sizes || productType.sizes.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Associated Sizes</CardTitle>
                    <CardDescription>
                        No sizes associated with this product type
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-8 text-center text-muted-foreground">
                        No sizes associated with this product type yet
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Associated Sizes</CardTitle>
                <CardDescription>
                    {productType.sizes.length} size(s) available for this
                    product type
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Size Label</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productType.sizes.map((size) => (
                            <TableRow key={size.id}>
                                <TableCell className="font-medium">
                                    {size.size_label}
                                </TableCell>
                                <TableCell className="font-mono">
                                    ৳
                                    {size.price
                                        ? parseFloat(
                                              size.price,
                                          ).toLocaleString()
                                        : '0'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            size.is_active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {size.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        size.created_at,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
