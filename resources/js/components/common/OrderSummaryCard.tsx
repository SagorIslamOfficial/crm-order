import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PriceDisplay } from './PriceDisplay';

interface OrderSummaryItem {
    label: string;
    amount: number;
    isTotal?: boolean;
}

interface OrderSummaryCardProps {
    items: OrderSummaryItem[];
    currency?: string;
    className?: string;
}

export function OrderSummaryCard({
    items,
    currency = 'USD',
    className = '',
}: OrderSummaryCardProps) {
    const totalItem = items.find((item) => item.isTotal);
    const regularItems = items.filter((item) => !item.isTotal);

    return (
        <Card className={className}>
            <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
                <div className="space-y-3">
                    {regularItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                        >
                            <span className="text-muted-foreground">
                                {item.label}
                            </span>
                            <PriceDisplay
                                amount={item.amount}
                                currency={currency}
                                size="sm"
                            />
                        </div>
                    ))}
                    {totalItem && (
                        <>
                            <Separator className="my-4" />
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">
                                    {totalItem.label}
                                </span>
                                <PriceDisplay
                                    amount={totalItem.amount}
                                    currency={currency}
                                    size="lg"
                                />
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
