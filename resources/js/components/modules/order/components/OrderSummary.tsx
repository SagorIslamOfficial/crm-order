import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderSummaryProps {
    subtotal: number;
    discount: number;
    total: number;
    discountType: 'fixed' | 'percentage';
    discountAmount: number | string;
    paidAmount?: number;
    children?: React.ReactNode;
}

export function OrderSummary({
    subtotal,
    discount,
    total,
    discountType,
    discountAmount,
    paidAmount = 0,
    children,
}: OrderSummaryProps) {
    const dueAmount = total - paidAmount;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-sm text-orange-600">
                        <span>
                            Discount{' '}
                            {discountType === 'percentage' &&
                                `(${discountAmount}%)`}
                            :
                        </span>
                        <span>-৳{discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                    <span>Total:</span>
                    <span>৳{total.toFixed(2)}</span>
                </div>
                {paidAmount > 0 && (
                    <>
                        <div className="flex justify-between pt-2 text-sm text-blue-600">
                            <span>Paid:</span>
                            <span>৳{paidAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Due:</span>
                            <span>৳{dueAmount.toFixed(2)}</span>
                        </div>
                    </>
                )}
                {children}
            </CardContent>
        </Card>
    );
}
