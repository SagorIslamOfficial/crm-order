import { formatDateForDisplay } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProductType } from '../types';

interface ProductTypeCardProps {
    productType: ProductType;
}

export function ProductTypeCard({ productType }: ProductTypeCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{productType.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Status
                        </label>
                        <div className="mt-1">
                            <Badge
                                variant={
                                    productType.is_active
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {productType.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Created
                        </label>
                        <p className="text-sm">
                            {formatDateForDisplay(productType.created_at)}
                        </p>
                    </div>
                </div>

                {productType.description && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Description
                        </label>
                        <p className="text-sm">{productType.description}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Sizes
                        </label>
                        <p className="text-sm font-medium">
                            {productType.sizes_count || 0}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Orders
                        </label>
                        <p className="text-sm font-medium">
                            {productType.orders_count || 0}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
