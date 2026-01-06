import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EditCustomerPageProps } from '@/modules/customer/types';
import { dashboard } from '@/routes';
import {
    index as customersIndex,
    show as customersShow,
    update as customersUpdate,
} from '@/routes/customers';
import { MainPageLayout } from '@/shared/components/layout/MainPageLayout';
import { type BreadcrumbItem } from '@/types';
import { Form } from '@inertiajs/react';
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
            <Form action={customersUpdate(customer.id).url} method="put">
                {({ errors, processing }) => (
                    <div className="mx-auto max-w-2xl space-y-6 rounded-lg border border-gray-200 p-6 dark:border-slate-700">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                defaultValue={customer.name}
                                required
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                name="phone"
                                defaultValue={customer.phone}
                                required
                            />
                            {errors.phone && (
                                <p className="text-xs text-destructive">
                                    {errors.phone}
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
                                type="text"
                                name="address"
                                defaultValue={customer.address || ''}
                            />
                            {errors.address && (
                                <p className="text-xs text-destructive">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Update Customer'}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </MainPageLayout>
    );
}
