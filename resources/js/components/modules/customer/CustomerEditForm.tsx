import { FormActions, InfoCard, InputField } from '@/components/common';
import {
    index as customersIndex,
    show as customersShow,
    update as customersUpdate,
} from '@/routes/customers';
import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import type { Customer } from './types';

interface CustomerEditFormProps {
    customer: Customer;
    className?: string;
}

export function CustomerEditForm({
    customer,
    className = '',
}: CustomerEditFormProps) {
    const { data, setData, processing, errors, put } = useForm({
        name: customer.name,
        phone: customer.phone,
        address: customer.address || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(customersUpdate(customer.id).url, {
            onSuccess: () => {
                toast.success('Customer updated successfully');
                router.get(customersShow(customer.id).url);
            },
            onError: () => {
                toast.error('Please check the form for errors');
            },
        });
    };

    const handleCancel = () => {
        router.get(customersIndex().url);
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            <InfoCard title="Edit Customer">
                <div className="mx-auto max-w-2xl space-y-6">
                    <InputField
                        id="name"
                        label="Customer Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                        placeholder="Enter customer name"
                    />

                    <InputField
                        type="tel"
                        id="phone"
                        label="Phone Number"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        error={errors.phone}
                        required
                        placeholder="Enter phone number"
                    />

                    <InputField
                        textarea
                        id="address"
                        label="Address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        error={errors.address}
                        placeholder="Enter customer address"
                        rows={3}
                    />
                </div>
            </InfoCard>

            <FormActions
                onCancel={handleCancel}
                isProcessing={processing}
                submitLabel="Save Changes"
                cancelLabel="Cancel"
            />
        </form>
    );
}
