import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import {
    index as customersIndex,
    store as customersStore,
} from '@/routes/customers';
import { MainPageLayout } from '@/shared/components/layout/MainPageLayout';
import { type BreadcrumbItem } from '@/types';
import { Form } from '@inertiajs/react';
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
                <div className="mx-auto max-w-2xl space-y-6 rounded-lg border border-gray-200 p-6 dark:border-slate-700">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Customer Name *</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="01701234567"
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            disabled={isSearching}
                        />
                        {isSearching && (
                            <p className="text-xs text-muted-foreground">
                                Searching...
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Must be 11 digits starting with 01
                        </p>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            placeholder="123 Main St, City, Country"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button type="submit">Create Customer</Button>
                    </div>
                </div>
            </Form>
        </MainPageLayout>
    );
}
