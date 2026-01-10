import { FormActions, InfoCard, InputField } from '@/components/common';
import {
    index as permissionsIndex,
    store as permissionsStore,
} from '@/routes/permissions';
import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface PermissionCreateFormProps {
    className?: string;
}

export function PermissionCreateForm({
    className = '',
}: PermissionCreateFormProps) {
    const { data, setData, processing, errors, post } = useForm({
        name: '',
        guard_name: 'web',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(permissionsStore().url, {
            onSuccess: () => {
                toast.success('Permission created successfully');
                router.get(permissionsIndex().url);
            },
            onError: () => {
                toast.error('Please check the form for errors');
            },
        });
    };

    const handleCancel = () => {
        router.get(permissionsIndex().url);
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            <InfoCard title="Create Permission">
                <div className="mx-auto max-w-2xl space-y-6">
                    <InputField
                        id="name"
                        label="Permission Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                        placeholder="e.g., users.create, orders.view"
                        helperText="Use lowercase with dots (e.g., resource.action). Only letters, numbers, dots, hyphens, and underscores allowed."
                    />

                    <InputField
                        id="guard_name"
                        label="Guard Name"
                        value={data.guard_name}
                        onChange={(e) => setData('guard_name', e.target.value)}
                        error={errors.guard_name}
                        required
                        placeholder="web"
                        helperText="The authentication guard this permission applies to (default: web)"
                    />
                </div>
            </InfoCard>

            <FormActions
                onCancel={handleCancel}
                isProcessing={processing}
                submitLabel="Create Permission"
                cancelLabel="Cancel"
            />
        </form>
    );
}
