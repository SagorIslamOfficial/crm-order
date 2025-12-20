import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

interface Permission {
    name: string;
    label: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: string[];
}

interface Props {
    role: Role;
    permissions: Permission[];
}

const breadcrumbs = (role: Role): BreadcrumbItem[] => [
    {
        title: 'Role Management',
        href: '/roles',
    },
    {
        title: role.name,
        href: `/roles/${role.id}`,
    },
    {
        title: 'Edit',
        href: `/roles/${role.id}/edit`,
    },
];

export default function RolesEdit({ role, permissions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        guard_name: role.guard_name,
        permissions: role.permissions,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(role.id).url, {
            onSuccess: () => {
                window.location.href = index().url;
            },
        });
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
        <AppLayout breadcrumbs={breadcrumbs(role)}>
            <Head title={`Edit ${role.name}`} />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Role
                        </h1>
                        <p className="text-muted-foreground">
                            Update role information and permissions
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Role Details</CardTitle>
                        <CardDescription>
                            Update the details for this role
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Role Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Enter role name"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guard_name">Guard Name</Label>
                                <Input
                                    id="guard_name"
                                    value={data.guard_name}
                                    onChange={(e) =>
                                        setData('guard_name', e.target.value)
                                    }
                                    placeholder="Enter guard name"
                                />
                                {errors.guard_name && (
                                    <p className="text-sm text-red-600">
                                        {errors.guard_name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Label>Permissions</Label>
                                <div className="grid max-h-96 gap-3 overflow-y-auto rounded-md border p-4">
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
                                                className="cursor-pointer text-sm"
                                            >
                                                {permission.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.permissions && (
                                    <p className="text-sm text-red-600">
                                        {errors.permissions}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'Updating...' : 'Update Role'}
                                </Button>
                                <Link href={index().url}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
