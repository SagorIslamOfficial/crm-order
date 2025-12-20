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
import { index, store } from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

interface Permission {
    name: string;
    label: string;
}

interface Props {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Management',
        href: '/roles',
    },
    {
        title: 'Create',
        href: '/roles/create',
    },
];

export default function RolesCreate({ permissions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        guard_name: 'web',
        permissions: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url, {
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create Role
                        </h1>
                        <p className="text-muted-foreground">
                            Add a new role to the system
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Role Details</CardTitle>
                        <CardDescription>
                            Enter the details for the new role
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
                                    {processing ? 'Creating...' : 'Create Role'}
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
