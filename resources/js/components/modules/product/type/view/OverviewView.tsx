import { DetailRow, InfoCard, StatusBadge } from '@/components/common';
import type { ProductType } from '@/components/modules/product/type/types/Product.types';

interface OverviewViewProps {
    productType: ProductType;
    className?: string;
}

export function OverviewView({ productType, className }: OverviewViewProps) {
    return (
        <div className={className}>
            <InfoCard title="Product Type Details">
                <div className="space-y-6">
                    <DetailRow label="Name" value={productType.name} />
                    <DetailRow
                        label="Description"
                        value={
                            <div className="break-all">
                                {productType.description || '-'}
                            </div>
                        }
                    />
                    <DetailRow
                        label="Status"
                        value={
                            <StatusBadge
                                variant={
                                    productType.is_active
                                        ? 'active'
                                        : 'inactive'
                                }
                            >
                                {productType.is_active ? 'Active' : 'Inactive'}
                            </StatusBadge>
                        }
                    />
                    <DetailRow
                        label="Total Sizes"
                        value={productType.sizes_count?.toString() || '0'}
                    />
                    <DetailRow
                        label="Total Orders"
                        value={productType.orders_count?.toString() || '0'}
                    />
                    <DetailRow
                        label="Created"
                        value={new Date(
                            productType.created_at,
                        ).toLocaleDateString()}
                    />
                </div>
            </InfoCard>
        </div>
    );
}
