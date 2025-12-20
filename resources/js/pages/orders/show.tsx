import PaymentModal from '@/components/payment-modal';
import StatusUpdateModal from '@/components/status-update-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit, Printer, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface OrderItem {
    id: string;
    product_type: {
        name: string;
    };
    product_size: {
        size_label: string;
    };
    quantity: number;
    price: string;
    line_total: string;
    notes: string | null;
}

interface Payment {
    id: string;
    method: string;
    amount: string;
    transaction_id: string | null;
    bank_name: string | null;
    account_number: string | null;
    mfs_provider: string | null;
    mfs_number: string | null;
    paid_at: string;
}

interface Order {
    id: string;
    order_number: string;
    customer: {
        id: string;
        name: string;
        phone: string;
        address: string | null;
    };
    shop: {
        id: string;
        name: string;
        code: string;
        address: string;
        phone: string;
    };
    items: OrderItem[];
    payments: Payment[];
    total_amount: string;
    advance_paid: string;
    due_amount: string;
    discount_amount: string;
    discount_type: 'fixed' | 'percentage';
    status: 'pending' | 'delivered' | 'cancelled';
    delivery_date: string;
    delivery_address: string | null;
    created_at: string;
}

interface ShowOrderPageProps extends PageProps {
    order: Order;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Orders',
        href: '/orders',
    },
];

const statusColors = {
    pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    delivered:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const paymentMethodLabels: Record<string, string> = {
    cash: 'Cash',
    bkash: 'bKash',
    nagad: 'Nagad',
    bank: 'Bank Transfer',
};

export default function ShowOrder({ order }: ShowOrderPageProps) {
    const [printCopyType, setPrintCopyType] = useState<
        'customer' | 'office' | 'tailor' | null
    >(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    const breadcrumbsWithOrder: BreadcrumbItem[] = [
        ...breadcrumbs,
        {
            title: order.order_number,
            href: `/orders/${order.id}`,
        },
    ];

    const handlePrint = (copyType: 'customer' | 'office' | 'tailor') => {
        setPrintCopyType(copyType);
        // Small delay to allow state to update before printing
        setTimeout(() => {
            window.print();
            // Reset after printing
            setTimeout(() => setPrintCopyType(null), 100);
        }, 100);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbsWithOrder}>
            <Head title={`Order ${order.order_number}`} />

            {/* Print-only content */}
            {printCopyType && (
                <div
                    className={`print-content hidden print:block ${printCopyType === 'tailor' ? 'print-tailor-copy' : ''}`}
                >
                    {/* Company Header */}
                    <div className="print-header">
                        <h1>Platinumys Fashion</h1>
                        <p>123 Fashion Street, Dhaka, Bangladesh</p>
                        <p>Phone: +880 1234-567890</p>
                    </div>

                    {/* Copy Type Badge */}
                    <div className="print-copy-type">
                        {printCopyType.toUpperCase()} COPY
                    </div>

                    {/* Order Header */}
                    <div style={{ marginBottom: '20px' }}>
                        <h2>Order: {order.order_number}</h2>
                        <p>
                            Order Date:{' '}
                            {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p>
                            Delivery Date:{' '}
                            {new Date(order.delivery_date).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Customer & Shop Details */}
                    <div className="print-details-grid">
                        <div className="print-details-section">
                            <h2>Customer Information</h2>
                            <p>
                                <strong>Name:</strong> {order.customer.name}
                            </p>
                            <p>
                                <strong>Phone:</strong> {order.customer.phone}
                            </p>
                            {order.customer.address && (
                                <p>
                                    <strong>Address:</strong>{' '}
                                    {order.customer.address}
                                </p>
                            )}
                        </div>
                        <div className="print-details-section">
                            <h2>Shop Information</h2>
                            <p>
                                <strong>Shop:</strong> {order.shop.name}
                            </p>
                            <p>
                                <strong>Address:</strong> {order.shop.address}
                            </p>
                            <p>
                                <strong>Phone:</strong> {order.shop.phone}
                            </p>
                        </div>
                    </div>

                    {order.delivery_address && (
                        <div style={{ marginBottom: '20px' }}>
                            <strong>Delivery Address:</strong>{' '}
                            {order.delivery_address}
                        </div>
                    )}

                    {/* Order Items Table */}
                    <div style={{ marginBottom: '20px' }}>
                        <h2>Order Items</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Size</th>
                                    <th>Quantity</th>
                                    {printCopyType !== 'tailor' && (
                                        <>
                                            <th>Price</th>
                                            <th>Subtotal</th>
                                        </>
                                    )}
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.product_type.name}</td>
                                        <td>{item.product_size.size_label}</td>
                                        <td>{item.quantity}</td>
                                        {printCopyType !== 'tailor' && (
                                            <>
                                                <td>৳{item.price}</td>
                                                <td>৳{item.line_total}</td>
                                            </>
                                        )}
                                        <td>{item.notes || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Payment Summary - Hide for Tailor Copy */}
                    {printCopyType !== 'tailor' && (
                        <div className="print-summary">
                            <div className="print-summary-row">
                                <span className="print-summary-label">
                                    Total Amount:
                                </span>
                                <span>৳{order.total_amount}</span>
                            </div>
                            {parseFloat(order.discount_amount) > 0 && (
                                <div className="print-summary-row">
                                    <span className="print-summary-label">
                                        Discount{' '}
                                        {order.discount_type === 'percentage'
                                            ? '(%)'
                                            : '(Fixed)'}
                                        :
                                    </span>
                                    <span>-৳{order.discount_amount}</span>
                                </div>
                            )}
                            <div className="print-summary-row">
                                <span className="print-summary-label">
                                    Paid:
                                </span>
                                <span>৳{order.advance_paid}</span>
                            </div>
                            <div className="print-summary-row print-total">
                                <span className="print-summary-label">
                                    Due Amount:
                                </span>
                                <span>৳{order.due_amount}</span>
                            </div>
                        </div>
                    )}

                    {/* Signatures */}
                    <div className="print-signatures">
                        <div className="print-signature">
                            <div className="print-signature-line">
                                Customer Signature
                            </div>
                        </div>
                        <div className="print-signature">
                            <div className="print-signature-line">
                                Authorized By
                            </div>
                        </div>
                        <div className="print-signature">
                            <div className="print-signature-line">
                                Received By
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="print-footer">
                        <p>
                            Thank you for your business! For any queries,
                            contact us at info@platinumysfashion.com
                        </p>
                        <p>This is a computer-generated document.</p>
                    </div>
                </div>
            )}

            {/* Screen-only content */}
            <div className="flex flex-col gap-4 p-4 print:hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {order.order_number}
                        </h1>
                        <p className="text-muted-foreground">
                            Created on{' '}
                            {new Date(order.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="no-print flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsStatusModalOpen(true)}
                        >
                            <RefreshCw className="mr-2 size-4" />
                            Update Status
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrint('customer')}
                        >
                            <Printer className="mr-2 size-4" />
                            Customer Copy
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrint('office')}
                        >
                            <Printer className="mr-2 size-4" />
                            Office Copy
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrint('tailor')}
                        >
                            <Printer className="mr-2 size-4" />
                            Tailor Copy
                        </Button>
                        <Link href={`/orders/${order.id}/edit`}>
                            <Button size="sm">
                                <Edit className="mr-2 size-4" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Name
                                </p>
                                <p className="font-medium">
                                    {order.customer.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Phone
                                </p>
                                <p className="font-medium">
                                    {order.customer.phone}
                                </p>
                            </div>
                            {order.customer.address && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Address
                                    </p>
                                    <p className="font-medium">
                                        {order.customer.address}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Shop
                                </p>
                                <p className="font-medium">{order.shop.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>
                                <Badge
                                    variant="outline"
                                    className={statusColors[order.status]}
                                >
                                    {order.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Delivery Date
                                </p>
                                <p className="font-medium">
                                    {new Date(
                                        order.delivery_date,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            {order.delivery_address && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Delivery Address
                                    </p>
                                    <p className="font-medium">
                                        {order.delivery_address}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Summary */}
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
                                    <span className="font-medium">
                                        ৳{order.total_amount}
                                    </span>
                                </div>
                                {parseFloat(order.discount_amount) > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Discount{' '}
                                            {order.discount_type ===
                                            'percentage'
                                                ? '(%)'
                                                : '(Fixed)'}
                                        </span>
                                        <span className="text-red-600">
                                            -৳{order.discount_amount}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Paid
                                    </span>
                                    <span className="font-medium text-green-600">
                                        ৳{order.advance_paid}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Due</span>
                                    <span className="text-orange-600">
                                        ৳{order.due_amount}
                                    </span>
                                </div>
                            </div>

                            {/* Add Payment Button - Only if payment is due */}
                            {parseFloat(order.due_amount) > 0 &&
                                order.status !== 'cancelled' && (
                                    <Button
                                        className="w-full"
                                        onClick={() =>
                                            setIsPaymentModalOpen(true)
                                        }
                                    >
                                        Add Payment
                                    </Button>
                                )}
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                            <CardDescription>
                                {order.items.length} item(s) in this order
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead className="text-right">
                                            Quantity
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Price
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Subtotal
                                        </TableHead>
                                        <TableHead>Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.product_type.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.product_size.size_label}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ৳{item.price}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ৳{item.line_total}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.notes || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Payment History */}
                    {order.payments.length > 0 && (
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Payment History</CardTitle>
                                <CardDescription>
                                    {order.payments.length} payment(s) recorded
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
                                            <TableHead className="text-right">
                                                Amount
                                            </TableHead>
                                            <TableHead>
                                                Transaction ID
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.payments.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell>
                                                    {new Date(
                                                        payment.paid_at,
                                                    ).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {
                                                            paymentMethodLabels[
                                                                payment.method
                                                            ]
                                                        }
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
                                                            {
                                                                payment.account_number
                                                            }
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
                                                                .replace(
                                                                    /\b\w/g,
                                                                    (c) =>
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
                                                    {payment.transaction_id ||
                                                        '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                open={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
                orderId={order.id}
                dueAmount={order.due_amount}
            />

            {/* Status Update Modal */}
            <StatusUpdateModal
                open={isStatusModalOpen}
                onOpenChange={setIsStatusModalOpen}
                orderId={order.id}
                currentStatus={order.status}
            />
        </AppLayout>
    );
}
