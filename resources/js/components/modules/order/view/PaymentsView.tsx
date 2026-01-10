import { InfoCard, PriceDisplay } from '@/components/common';
import type { Order } from '@/components/modules/order/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface PaymentsViewProps {
    order: Order;
    className?: string;
}

export function PaymentsView({ order, className }: PaymentsViewProps) {
    const payments = order.payments || [];
    const hasDue = parseFloat(order.due_amount) > 0;

    return (
        <div className={className}>
            <InfoCard title="Payment History">
                {payments.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        No payments recorded yet
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Transaction ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>
                                        {new Date(
                                            payment.paid_at,
                                        ).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        <PriceDisplay
                                            amount={parseFloat(payment.amount)}
                                        />
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {payment.method}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {payment.transaction_id || '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Payment Summary */}
                <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Total Paid:
                        </span>
                        <span className="font-semibold">
                            <PriceDisplay
                                amount={parseFloat(order.advance_paid)}
                            />
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Due Amount:
                        </span>
                        <span
                            className={`font-bold ${hasDue ? 'text-red-600' : 'text-green-600'}`}
                        >
                            <PriceDisplay
                                amount={parseFloat(order.due_amount)}
                            />
                        </span>
                    </div>
                </div>
            </InfoCard>
        </div>
    );
}
