import { TabsNavigation } from '@/components/common';
import type { Order } from '@/components/modules/order/types';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ReactNode, useState } from 'react';
import { ItemsView, OverviewView, PaymentsView } from './view';

interface OrderShowProps {
    order: Order;
    onAddPayment?: () => void;
    className?: string;
    actions?: ReactNode;
}

export function OrderShow({
    order,
    onAddPayment,
    className,
    actions,
}: OrderShowProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { value: 'overview', label: 'Overview' },
        {
            value: 'items',
            label: `Items (${order.items?.length || 0})`,
        },
        {
            value: 'payments',
            label: `Payments (${order.payments?.length || 0})`,
        },
    ];

    return (
        <div className={className}>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
            >
                <div className="flex items-center justify-between">
                    <TabsNavigation tabs={tabs} />
                    {actions && <div>{actions}</div>}
                </div>

                <TabsContent value="overview">
                    <OverviewView order={order} onAddPayment={onAddPayment} />
                </TabsContent>

                <TabsContent value="items">
                    <ItemsView order={order} />
                </TabsContent>

                <TabsContent value="payments">
                    <PaymentsView order={order} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
