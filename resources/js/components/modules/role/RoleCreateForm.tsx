import { FormActions, InfoCard, InputField } from '@/components/common';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { index as rolesIndex, store as rolesStore } from '@/routes/roles';
import { router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import type { Permission } from './types';

interface RoleCreateFormProps {
    permissions: Permission[];
    className?: string;
}

export function RoleCreateForm({
    permissions,
    className = '',
}: RoleCreateFormProps) {
    const { data, setData, processing, errors, post } = useForm({
        name: '',
        guard_name: 'web',
        permissions: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(rolesStore().url, {
            onSuccess: () => {
                toast.success('Role created successfully');
                router.get(rolesIndex().url);
            },
            onError: () => {
                toast.error('Please check the form for errors');
            },
        });
    };

    const handleCancel = () => {
        router.get(rolesIndex().url);
    };

    const handlePermissionChange = (
        permissionName: string,
        checked: boolean,
    ) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData(
                'permissions',
                data.permissions.filter(
                    (permission) => permission !== permissionName,
                ),
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            <InfoCard title="Create Role">
                <div className="mx-auto max-w-2xl space-y-6">
                    <InputField
                        id="name"
                        label="Role Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                        placeholder="Enter role name"
                    />

                    <div className="space-y-4">
                        <Label>Permissions</Label>
                        <div className="grid max-h-96 grid-cols-3 gap-3 overflow-y-auto rounded-md border p-4">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.name}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`permission-${permission.name}`}
                                        checked={data.permissions.includes(
                                            permission.name,
                                        )}
                                        onCheckedChange={(checked) =>
                                            handlePermissionChange(
                                                permission.name,
                                                Boolean(checked),
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor={`permission-${permission.name}`}
                                        className="cursor-pointer text-sm font-normal"
                                    >
                                        {permission.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.permissions && (
                            <p className="text-sm text-destructive">
                                {errors.permissions}
                            </p>
                        )}
                    </div>
                </div>
            </InfoCard>

            <FormActions
                onCancel={handleCancel}
                isProcessing={processing}
                submitLabel="Create Role"
                cancelLabel="Cancel"
            />
        </form>
    );
}
