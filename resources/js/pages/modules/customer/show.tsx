import { OrderHistoryTable } from '@/modules/customer/components';
import type { Customer } from '@/modules/customer/types';
import { dashboard } from '@/routes';
import {
    edit as customersEdit,
    index as customersIndex,
    show as customersShow,
} from '@/routes/customers';
import { MainPageLayout } from '@/shared/components';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Edit } from 'lucide-react';

interface ShowCustomerPageProps extends PageProps {
    customer: Customer;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Customers',
        href: customersIndex().url,
    },
];

export default function ShowCustomer({ customer }: ShowCustomerPageProps) {
    const breadcrumbsWithCustomer: BreadcrumbItem[] = [
        ...breadcrumbs,
        {
            title: customer.name,
            href: customersShow(customer.id).url,
        },
    ];

    return (
        <MainPageLayout
            title={customer.name}
            description={`Customer since ${new Date(customer.created_at).toLocaleDateString()}`}
            breadcrumbs={breadcrumbsWithCustomer}
            editButton={{
                href: customersEdit(customer.id).url,
                icon: Edit,
                permission: 'customers.edit',
            }}
            useCard={false}
        >
            <div className="space-y-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 gap-6 rounded-lg border border-gray-200 p-4 md:grid-cols-4 dark:border-slate-700">
                    <div>
                        <h3 className="mb-4 font-semibold">Customer Details</h3>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-mono font-medium">
                            {customer.phone}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="text-sm">{customer.address || '-'}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Member Since
                        </p>
                        <p className="text-sm">
                            {new Date(customer.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="col-span-2">
                    <OrderHistoryTable
                        orders={
                            customer.orders || {
                                data: [],
                                current_page: 1,
                                from: null,
                                last_page: 1,
                                links: [],
                                next_page_url: null,
                                path: '',
                                per_page: 10,
                                prev_page_url: null,
                                to: null,
                                total: 0,
                            }
                        }
                    />
                </div>
            </div>
        </MainPageLayout>
    );
}
