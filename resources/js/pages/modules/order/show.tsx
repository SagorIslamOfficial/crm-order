import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { OrderShow } from '@/components/modules/order';
import { OrderActions } from '@/components/modules/order/components/OrderActions';
import { OrderPrintTemplate } from '@/components/modules/order/components/OrderPrintTemplate';
import type { Order } from '@/components/modules/order/types';
import PaymentModal from '@/components/payment-modal';
import StatusUpdateModal from '@/components/status-update-modal';
import { dashboard } from '@/routes';
import {
    edit as ordersEdit,
    index as ordersIndex,
    show as ordersShow,
} from '@/routes/orders';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { ArrowLeft, Edit } from 'lucide-react';
import { useState } from 'react';

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
                breadcrumbs={breadcrumbsWithOrder}
                backButton={{
                    label: 'Back',
                    href: ordersIndex().url,
                    icon: ArrowLeft,
                }}
                editButton={{
                    label: 'Edit',
                    href: ordersEdit(order.id).url,
                    icon: Edit,
                }}
                useCard={false}
            >
                <div className="print:hidden">
                    <OrderShow
                        order={order}
                        onAddPayment={() => setIsPaymentModalOpen(true)}
                        actions={
                            <OrderActions
                                onStatusClick={() => setIsStatusModalOpen(true)}
                                onPrintClick={handlePrint}
                            />
                        }
                    />
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
