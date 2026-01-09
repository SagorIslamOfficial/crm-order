import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { CustomerEditForm } from '@/components/modules/customer';
import type { EditCustomerPageProps } from '@/components/modules/customer/types';
import { dashboard } from '@/routes';
import {
    index as customersIndex,
    show as customersShow,
} from '@/routes/customers';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-react';

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

export default function EditCustomer({ customer }: EditCustomerPageProps) {
    const breadcrumbsWithCustomer: BreadcrumbItem[] = [
        ...breadcrumbs,
        {
            title: customer.name,
            href: customersShow(customer.id).url,
        },
        {
            title: 'Edit',
            href: '#',
        },
    ];

    return (
        <MainPageLayout
            title={`Edit ${customer.name}`}
            description="Update customer information"
            breadcrumbs={breadcrumbsWithCustomer}
            backButton={{
                href: customersShow(customer.id).url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <div className="mx-auto max-w-2xl">
                <CustomerEditForm customer={customer} />
            </div>
        </MainPageLayout>
    );
}
