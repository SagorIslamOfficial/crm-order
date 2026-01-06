import type { Customer } from '../types';
import { InfoCard } from './InfoCard';

interface CustomerDetailsProps {
    customer: Customer;
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
    const items = [
        {
            label: 'Phone',
            value: (
                <span className="font-mono font-semibold">
                    {customer.phone}
                </span>
            ),
        },
        {
            label: 'Address',
            value: customer.address || '-',
            hidden: !customer.address,
        },
        {
            label: 'Customer Since',
            value: new Date(customer.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        },
    ];

    return <InfoCard title="Contact Information" items={items} />;
}
