import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PaymentSummaryProps {
    totalAmount: string;
    discountAmount: string;
    discountType: 'fixed' | 'percentage';
    advancePaid: string;
    dueAmount: string;
    orderStatus: string;
    onAddPayment?: () => void;
}

export function PaymentSummary({
    totalAmount,
    discountAmount,
    discountType,
    advancePaid,
    dueAmount,
    orderStatus,
    onAddPayment,
}: PaymentSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Total Amount
                        </span>
                        <span className="font-medium">৳{totalAmount}</span>
                    </div>
                    {parseFloat(discountAmount) > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Discount{' '}
                                {discountType === 'percentage'
                                    ? `(${((parseFloat(discountAmount) / (parseFloat(totalAmount) + parseFloat(discountAmount))) * 100).toFixed(2)}%)`
                                    : '(fixed)'}
                            </span>
                            <span className="text-red-600">
                                -৳{discountAmount}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid</span>
                        <span className="font-medium text-green-600">
                            ৳{advancePaid}
                        </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Due</span>
                        <span className="text-orange-600">৳{dueAmount}</span>
                    </div>
                </div>

                {parseFloat(dueAmount) > 0 && orderStatus !== 'cancelled' && (
                    <Button className="w-full" onClick={onAddPayment}>
                        Add Payment
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
