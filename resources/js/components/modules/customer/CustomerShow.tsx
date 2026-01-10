import { TabsNavigation } from '@/components/common';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import { OrdersView, OverviewView } from './view';

import type { Customer } from './types';

interface CustomerShowProps {
    customer: Customer;
    className?: string;
}

export function CustomerShow({ customer, className = '' }: CustomerShowProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { value: 'overview', label: 'Overview' },
        {
            value: 'orders',
            label: `Orders (${customer.orders?.total || 0})`,
        },
    ];

    // Ensure orders structure exists
    const orders = customer.orders || {
        data: [],
        current_page: 1,
        from: null,
        last_page: 1,
        per_page: 10,
        to: null,
        total: 0,
        links: [],
        next_page_url: null,
        prev_page_url: null,
        path: '',
    };

    return (
        <div className={className}>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
            >
                <TabsNavigation tabs={tabs} />

                <TabsContent value="overview" className="space-y-4">
                    <OverviewView customer={customer} />
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                    <OrdersView orders={orders} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
