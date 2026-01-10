import {
    DetailRow,
    InfoCard,
    OrderStatusBadge,
    PriceDisplay,
} from '@/components/common';
import type { Order } from '@/components/modules/order/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface OverviewViewProps {
    order: Order;
    onAddPayment?: () => void;
    className?: string;
}

export function OverviewView({
    order,
    onAddPayment,
    className,
}: OverviewViewProps) {
    const hasDue = parseFloat(order.due_amount) > 0;

    return (
        <div className={className}>
            <div className="grid grid-cols-3 gap-6">
                {/* Customer Information */}
                <InfoCard title="Customer Information">
                    <div className="space-y-3">
                        <DetailRow label="Name" value={order.customer.name} />
                        <DetailRow label="Phone" value={order.customer.phone} />
                        <DetailRow
                            label="Address"
                            value={order.customer.address || '-'}
                        />
                    </div>
                </InfoCard>

                {/* Order Details */}
                <InfoCard title="Order Details">
                    <div className="space-y-3">
                        <DetailRow
                            label="Shop"
                            value={`${order.shop.name} (${order.shop.code})`}
                        />
                        <DetailRow
                            label="Status"
                            value={<OrderStatusBadge status={order.status} />}
                        />
                        <DetailRow
                            label="Delivery Date"
                            value={new Date(
                                order.delivery_date,
                            ).toLocaleDateString()}
                        />
                        <DetailRow
                            label="Delivery Address"
                            value={order.delivery_address || '-'}
                        />
                    </div>
                </InfoCard>

                {/* Payment Summary */}
                <InfoCard title="Payment Summary">
                    {(() => {
                        // Calculate subtotal from items or derive from total + discount
                        const total = parseFloat(order.total_amount);
                        const advancePaid = parseFloat(order.advance_paid) || 0;
                        const dueAmount = parseFloat(order.due_amount) || 0;

                        // Calculate subtotal (items sum or total + discount for fixed)
                        const itemsSubtotal =
                            order.items?.reduce(
                                (sum, item) =>
                                    sum + parseFloat(item.line_total),
                                0,
                            ) || 0;
                        const subtotal =
                            itemsSubtotal > 0 ? itemsSubtotal : total;

                        // Calculate actual discount value
                        const discountValue = subtotal - total;

                        // Calculate percentage for display
                        const discountPercentage =
                            subtotal > 0 && discountValue > 0
                                ? ((discountValue / subtotal) * 100).toFixed(0)
                                : 0;

                        return (
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <PriceDisplay amount={subtotal} />
                                </div>

                                {discountValue > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-orange-600">
                                            Discount
                                            {order.discount_type ===
                                            'percentage'
                                                ? ` (${discountPercentage}%)`
                                                : ' (Fixed)'}
                                        </span>
                                        <span className="text-orange-600">
                                            -
                                            <PriceDisplay
                                                amount={discountValue}
                                            />
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between border-t pt-3 font-semibold">
                                    <span>Total</span>
                                    <PriceDisplay amount={total} />
                                </div>

                                {advancePaid > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-blue-600">
                                            Paid
                                        </span>
                                        <span className="text-blue-600">
                                            <PriceDisplay
                                                amount={advancePaid}
                                            />
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span
                                        className={
                                            dueAmount > 0
                                                ? 'font-semibold text-red-600'
                                                : 'font-semibold text-green-600'
                                        }
                                    >
                                        Due
                                    </span>
                                    <span
                                        className={
                                            dueAmount > 0
                                                ? 'font-semibold text-red-600'
                                                : 'font-semibold text-green-600'
                                        }
                                    >
                                        <PriceDisplay amount={dueAmount} />
                                    </span>
                                </div>

                                {hasDue && onAddPayment && (
                                    <Button
                                        onClick={onAddPayment}
                                        size="lg"
                                        variant="default"
                                        className="mt-4 w-full gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Payment
                                    </Button>
                                )}
                            </div>
                        );
                    })()}
                </InfoCard>
            </div>
        </div>
    );
}
