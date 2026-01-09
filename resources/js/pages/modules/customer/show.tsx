import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { CustomerShow } from '@/components/modules/customer';
import type { Customer } from '@/components/modules/customer/types';
import { dashboard } from '@/routes';
import {
    index as customersIndex,
    show as customersShow,
} from '@/routes/customers';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { ArrowLeft } from 'lucide-react';

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
            backButton={{
                href: customersIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <div className="space-y-6">
                <CustomerShow customer={customer} />
            </div>
        </MainPageLayout>
    );
}
