import { FormActions, InfoCard, InputField } from '@/components/common';
import {
    index as permissionsIndex,
    show as permissionsShow,
    update as permissionsUpdate,
} from '@/routes/permissions';
import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import type { Permission } from './types';

interface PermissionEditFormProps {
    permission: Permission;
    className?: string;
}

export function PermissionEditForm({
    permission,
    className = '',
}: PermissionEditFormProps) {
    const { data, setData, processing, errors, put } = useForm({
        name: permission.name,
        guard_name: permission.guard_name,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(permissionsUpdate(permission.id).url, {
            onSuccess: () => {
                toast.success('Permission updated successfully');
                router.get(permissionsShow(permission.id).url);
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
            <InfoCard title="Edit Permission">
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
                submitLabel="Update Permission"
                cancelLabel="Cancel"
            />
        </form>
    );
}
