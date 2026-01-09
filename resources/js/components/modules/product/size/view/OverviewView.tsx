import { DetailRow, InfoCard, StatusBadge } from '@/components/common';
import type { ProductSize } from '@/components/modules/product/size/types/Product.types';

interface OverviewViewProps {
    productSize: ProductSize;
}

export function OverviewView({ productSize }: OverviewViewProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <InfoCard title="Product Size Details">
                <div className="space-y-4">
                    <DetailRow
                        label="Size Label"
                        value={productSize.size_label}
                    />
                    <DetailRow
                        label="Product Type"
                        value={productSize.product_type?.name || '-'}
                    />

                    <DetailRow
                        label="Status"
                        value={
                            <StatusBadge
                                variant={
                                    productSize.is_active
                                        ? 'active'
                                        : 'inactive'
                                }
                            >
                                {productSize.is_active ? 'Active' : 'Inactive'}
                            </StatusBadge>
                        }
                    />
                    <DetailRow
                        label="Created"
                        value={new Date(
                            productSize.created_at,
                        ).toLocaleDateString()}
                    />
                </div>
            </InfoCard>
        </div>
    );
}
