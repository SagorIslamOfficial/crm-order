import { DetailRow, InfoCard, StatusBadge } from '@/components/common';
import type { Shop } from '@/components/modules/shop/types/Shop.types';

interface OverviewViewProps {
    shop: Shop;
}

export function OverviewView({ shop }: OverviewViewProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {/* Shop Information */}
            <InfoCard title="Shop Information">
                <div className="space-y-4">
                    <DetailRow label="Shop Code" value={shop.code} />
                    <DetailRow label="Shop Name" value={shop.name} />
                    <DetailRow
                        label="Status"
                        value={
                            <StatusBadge
                                variant={shop.is_active ? 'active' : 'inactive'}
                            >
                                {shop.is_active ? 'Active' : 'Inactive'}
                            </StatusBadge>
                        }
                    />
                    <DetailRow label="Address" value={shop.address} />
                </div>
            </InfoCard>

            {/* Contact Information */}
            <InfoCard title="Contact Information">
                <div className="space-y-4">
                    <DetailRow label="Phone" value={shop.phone} />
                    <DetailRow
                        label="Website"
                        value={
                            shop.website ? (
                                <a
                                    href={`https://${shop.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    {shop.website}
                                </a>
                            ) : (
                                '-'
                            )
                        }
                    />
                    <DetailRow label="Details" value={shop.details || '-'} />
                </div>
            </InfoCard>

            {/* Order Management & Metadata */}
            <InfoCard title="Shop Management">
                <div className="space-y-4">
                    <DetailRow
                        label="Total Orders"
                        value={shop.orders_count?.toString() || '0'}
                    />
                    <DetailRow
                        label="Next Order Sequence"
                        value={String(shop.next_order_sequence).padStart(
                            6,
                            '0',
                        )}
                    />
                    <DetailRow
                        label="Created"
                        value={new Date(shop.created_at).toLocaleDateString()}
                    />
                </div>
            </InfoCard>
        </div>
    );
}
