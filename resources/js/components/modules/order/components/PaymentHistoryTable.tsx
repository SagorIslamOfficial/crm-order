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
import type { Payment } from '../types';

const paymentMethodLabels: Record<string, string> = {
    cash: 'Cash',
    bkash: 'bKash',
    nagad: 'Nagad',
    bank: 'Bank Transfer',
};

interface PaymentHistoryTableProps {
    payments: Payment[];
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
    if (payments.length === 0) return null;

    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                    {payments.length} payment(s) recorded
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Phone/Bank</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Transaction ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>
                                    {new Date(payment.paid_at).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {paymentMethodLabels[payment.method]}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {payment.mfs_number && (
                                        <div className="text-sm">
                                            {payment.mfs_number}
                                        </div>
                                    )}
                                    {payment.account_number && (
                                        <div className="text-sm">
                                            {payment.account_number}
                                        </div>
                                    )}
                                    {!payment.mfs_number &&
                                        !payment.account_number && (
                                            <span className="text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                </TableCell>
                                <TableCell>
                                    {payment.mfs_provider && (
                                        <div className="text-sm">
                                            {payment.mfs_provider
                                                .split('_')[1]
                                                .replace(/\b\w/g, (c) =>
                                                    c.toUpperCase(),
                                                )}
                                        </div>
                                    )}
                                    {payment.bank_name && (
                                        <div className="text-sm">
                                            {payment.bank_name}
                                        </div>
                                    )}
                                    {!payment.mfs_provider &&
                                        !payment.bank_name && (
                                            <span className="text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    ৳{payment.amount}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {payment.transaction_id || '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
