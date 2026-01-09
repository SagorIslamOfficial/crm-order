import { FormActions, InfoCard, InputField } from '@/components/common';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    index as usersIndex,
    show as usersShow,
    update as usersUpdate,
} from '@/routes/users';
import { router, useForm } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import type { Role, User } from './types';

interface UserEditFormProps {
    user: User;
    roles: Role[];
    className?: string;
}

export function UserEditForm({
    user,
    roles,
    className = '',
}: UserEditFormProps) {
    const { data, setData, processing, errors, put } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        roles: user.roles,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(usersUpdate(user.id).url, {
            onSuccess: () => {
                toast.success('User updated successfully');
                router.get(usersShow(user.id).url);
            },
            onError: () => {
                toast.error('Please check the form for errors');
            },
        });
    };

    const handleCancel = () => {
        router.get(usersIndex().url);
    };

    const handleRoleChange = (roleName: string, checked: boolean) => {
        if (checked) {
            setData('roles', [...data.roles, roleName]);
        } else {
            setData(
                'roles',
                data.roles.filter((role) => role !== roleName),
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            <InfoCard title="Edit User">
                <div className="mx-auto max-w-2xl space-y-6">
                    <InputField
                        id="name"
                        label="Full Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                        placeholder="Enter full name"
                    />

                    <InputField
                        type="email"
                        id="email"
                        label="Email Address"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        required
                        placeholder="Enter email address"
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                        <InputField
                            type="password"
                            id="password"
                            label="New Password (Optional)"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            error={errors.password}
                            placeholder="Leave blank to keep current password"
                        />

                        <InputField
                            type="password"
                            id="password_confirmation"
                            label="Confirm New Password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            error={errors.password_confirmation}
                            placeholder="Confirm new password"
                        />
                    </div>

                    {!data.roles.includes('Administrator') && (
                        <div className="space-y-4">
                            <Label>Roles</Label>
                            <div className="grid grid-cols-2 gap-3 rounded-md border p-4">
                                <TooltipProvider>
                                    {roles.map((role) => (
                                        <div
                                            key={role.name}
                                            className="flex items-center space-x-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`role-${role.name}`}
                                                    checked={data.roles.includes(
                                                        role.name,
                                                    )}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        handleRoleChange(
                                                            role.name,
                                                            Boolean(checked),
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`role-${role.name}`}
                                                    className="cursor-pointer font-normal"
                                                >
                                                    {role.label}
                                                </Label>
                                            </div>
                                            {role.permissions &&
                                                role.permissions.length > 0 && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <Shield className="h-3 w-3" />
                                                                <span>
                                                                    {
                                                                        role
                                                                            .permissions
                                                                            .length
                                                                    }
                                                                </span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent
                                                            side="left"
                                                            className="max-w-xs"
                                                        >
                                                            <div className="space-y-2">
                                                                <p className="font-semibold">
                                                                    Permissions:
                                                                </p>
                                                                <ul className="list-inside list-disc space-y-1 text-xs">
                                                                    {role.permissions.map(
                                                                        (
                                                                            permission,
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    permission
                                                                                }
                                                                            >
                                                                                {
                                                                                    permission
                                                                                }
                                                                            </li>
                                                                        ),
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                        </div>
                                    ))}
                                </TooltipProvider>
                            </div>
                            {errors.roles && (
                                <p className="text-sm text-destructive">
                                    {errors.roles}
                                </p>
                            )}
                        </div>
                    )}

                    {data.roles.includes('Administrator') && (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Note:</strong> Administrator role cannot
                                be modified to prevent accidental privilege
                                removal.
                            </p>
                        </div>
                    )}
                </div>
            </InfoCard>

            <FormActions
                onCancel={handleCancel}
                isProcessing={processing}
                submitLabel="Update User"
                cancelLabel="Cancel"
            />
        </form>
    );
}
