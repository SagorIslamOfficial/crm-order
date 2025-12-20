import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { show, update } from '@/routes/customers';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Customer {
    id: string;
    phone: string;
    name: string;
    address: string | null;
}

interface Props extends PageProps {
    customer: Customer;
}

export default function CustomersEdit({ customer }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Customers',
            href: '/customers',
        },
        {
            title: customer.name,
            href: show(customer.id).url,
        },
        {
            title: 'Edit',
            href: '#',
        },
    ];

    const { data, setData, patch, processing, errors } = useForm({
        phone: customer.phone,
        name: customer.name,
        address: customer.address || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(update(customer.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${customer.name}`} />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Edit Customer
                    </h1>
                    <p className="text-muted-foreground">
                        Update customer information
                    </p>
                </div>

                {/* Form */}
                <div className="max-w-2xl rounded-lg border border-gray-200 p-6 dark:border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                type="text"
                                placeholder="01701234567"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className={errors.phone ? 'border-red-500' : ''}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-500">
                                    {errors.phone}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Must be 11 digits starting with 01
                            </p>
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Customer Name *</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                placeholder="123 Main St, City, Country"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                            />
                            {errors.address && (
                                <p className="text-sm text-red-500">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-6">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Customer'}
                            </Button>
                            <Link href={show(customer.id).url}>
                                <Button variant="outline">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
