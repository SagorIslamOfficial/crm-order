import { FormActions } from '@/components/common';
import { InputField } from '@/components/common/InputField';
import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { dashboard } from '@/routes';
import {
    index as customersIndex,
    store as customersStore,
} from '@/routes/customers';
import { type BreadcrumbItem } from '@/types';
import { Form, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Customers',
        href: customersIndex().url,
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function CreateCustomer() {
    const [phone, setPhone] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const searchCustomer = async () => {
        if (!phone || phone.length !== 11) {
            return;
        }

        setIsSearching(true);

        try {
            const response = await fetch(
                `/api/customers/lookup?phone=${phone}`,
            );
            const data: {
                found: boolean;
                customer?: {
                    id: string;
                    name: string;
                    phone: string;
                    address: string | null;
                };
            } = await response.json();

            if (data.found && data.customer) {
                console.log('Customer found:', data.customer);
            }
        } catch (error) {
            console.error('Error searching customer:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handlePhoneChange = (value: string) => {
        setPhone(value);
        if (value.length === 11) {
            searchCustomer();
        }
    };

    return (
        <MainPageLayout
            title="Create Customer"
            description="Add a new customer to system"
            breadcrumbs={breadcrumbs}
            backButton={{
                href: customersIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <Form action={customersStore().url} method="post">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-4 space-y-6 rounded-lg border border-gray-200 p-6 dark:border-slate-700">
                        <h4 className="font-semibold tracking-tight">
                            Create Customer
                        </h4>
                        {/* Name */}
                        <InputField
                            id="name"
                            label="Customer Name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            required
                        />

                        {/* Phone */}
                        <InputField
                            id="phone"
                            label="Phone Number"
                            type="tel"
                            name="phone"
                            placeholder="01701234567"
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            disabled={isSearching}
                            required
                            helperText={
                                isSearching ? (
                                    <span className="text-muted-foreground">
                                        Searching...
                                    </span>
                                ) : (
                                    'Must be 11 digits starting with 01'
                                )
                            }
                        />

                        {/* Address */}
                        <InputField
                            textarea
                            id="address"
                            label="Address"
                            name="address"
                            placeholder="123 Main St, City, Country"
                        />
                    </div>

                    {/* Actions */}
                    <FormActions
                        onCancel={() => router.visit(customersIndex().url)}
                        submitLabel="Create Customer"
                        cancelLabel="Cancel"
                    />
                </div>
            </Form>
        </MainPageLayout>
    );
}
