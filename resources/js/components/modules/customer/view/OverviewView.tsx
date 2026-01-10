import { DetailRow, InfoCard, formatDateForDisplay } from '@/components/common';
import type { Customer } from '../types';

interface OverviewViewProps {
    customer: Customer;
}

export function OverviewView({ customer }: OverviewViewProps) {
    return (
        <div className="space-y-6">
            <InfoCard title="Customer Information">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <DetailRow label="Customer Name" value={customer.name} />
                    <DetailRow label="Phone Number" value={customer.phone} />
                    <DetailRow
                        label="Address"
                        value={customer.address || '-'}
                    />
                    <DetailRow
                        label="Member Since"
                        value={formatDateForDisplay(customer.created_at)}
                    />
                    <DetailRow
                        label="Last Updated"
                        value={formatDateForDisplay(customer.updated_at)}
                    />
                </div>
            </InfoCard>
        </div>
    );
}
