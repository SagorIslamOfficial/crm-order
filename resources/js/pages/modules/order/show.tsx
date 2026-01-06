import PaymentModal from '@/components/payment-modal';
import StatusUpdateModal from '@/components/status-update-modal';
import { InfoCard } from '@/modules/order/components/InfoCard';
import { OrderActions } from '@/modules/order/components/OrderActions';
import { OrderItemsTable } from '@/modules/order/components/OrderItemsTable';
import { OrderPrintTemplate } from '@/modules/order/components/OrderPrintTemplate';
import { PaymentHistoryTable } from '@/modules/order/components/PaymentHistoryTable';
import { PaymentSummary } from '@/modules/order/components/PaymentSummary';
import type { Order } from '@/modules/order/types';
import { dashboard } from '@/routes';
import {
    edit as ordersEdit,
    index as ordersIndex,
    show as ordersShow,
} from '@/routes/orders';
import { MainPageLayout } from '@/shared/components';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { ArrowLeft, Edit } from 'lucide-react';
import { useState } from 'react';

const statusColors = {
    pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    delivered:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

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
        href: ordersIndex().url,
    },
];

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
            href: ordersShow(order.id).url,
        },
    ];

    const handlePrint = (copyType: 'customer' | 'office' | 'tailor') => {
        setPrintCopyType(copyType);
        setTimeout(() => {
            window.print();
            setTimeout(() => setPrintCopyType(null), 100);
        }, 100);
    };

    return (
        <>
            {/* Print Template */}
            <OrderPrintTemplate order={order} printCopyType={printCopyType} />

            <MainPageLayout
                title={order.order_number}
                description={`Created on ${new Date(order.created_at).toLocaleDateString()}`}
                breadcrumbs={breadcrumbsWithOrder}
                backButton={{
                    label: 'Back',
                    href: ordersIndex().url,
                    icon: ArrowLeft,
                }}
                editButton={{
                    href: ordersEdit(order.id).url,
                    icon: Edit,
                    permission: 'orders.edit',
                }}
                useCard={false}
            >
                <div className="flex flex-col gap-4 print:hidden">
                    <OrderActions
                        onStatusClick={() => setIsStatusModalOpen(true)}
                        onPrintClick={handlePrint}
                    />

                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Customer Information */}
                        <InfoCard
                            title="Customer"
                            items={[
                                {
                                    label: 'Name',
                                    value: order.customer.name,
                                },
                                {
                                    label: 'Phone',
                                    value: order.customer.phone,
                                },
                                {
                                    label: 'Address',
                                    value: order.customer.address,
                                    hidden: !order.customer.address,
                                },
                            ]}
                        />

                        {/* Order Information */}
                        <InfoCard
                            title="Order Details"
                            items={[
                                {
                                    label: 'Shop',
                                    value: `${order.shop.name} (${order.shop.code})`,
                                },
                                {
                                    label: 'Status',
                                    value: (
                                        <div
                                            className={`inline-block rounded px-2 py-1 text-sm font-medium ${statusColors[order.status]}`}
                                        >
                                            {order.status}
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Delivery Date',
                                    value: new Date(
                                        order.delivery_date,
                                    ).toLocaleDateString(),
                                },
                                {
                                    label: 'Delivery Address',
                                    value: order.delivery_address,
                                    hidden: !order.delivery_address,
                                },
                            ]}
                        />

                        {/* Payment Summary */}
                        <PaymentSummary
                            totalAmount={order.total_amount}
                            discountAmount={order.discount_amount}
                            discountType={order.discount_type}
                            advancePaid={order.advance_paid}
                            dueAmount={order.due_amount}
                            orderStatus={order.status}
                            onAddPayment={() => setIsPaymentModalOpen(true)}
                        />

                        {/* Order Items */}
                        <OrderItemsTable items={order.items} />

                        {/* Payment History */}
                        <PaymentHistoryTable payments={order.payments} />
                    </div>
                </div>
            </MainPageLayout>

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
        </>
    );
}
