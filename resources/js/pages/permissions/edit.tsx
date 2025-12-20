import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/permissions';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Props {
    permission: Permission;
}

const breadcrumbs = (permission: Permission): BreadcrumbItem[] => [
    {
        title: 'Permission Management',
        href: '/permissions',
    },
    {
        title: permission.name,
        href: `/permissions/${permission.id}`,
    },
    {
        title: 'Edit',
        href: `/permissions/${permission.id}/edit`,
    },
];

export default function PermissionsEdit({ permission }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: permission.name,
        guard_name: permission.guard_name,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(permission.id).url, {
            onSuccess: () => {
                window.location.href = index().url;
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(permission)}>
            <Head title={`Edit ${permission.name}`} />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Permission
                        </h1>
                        <p className="text-muted-foreground">
                            Update permission information
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Permission Details</CardTitle>
                        <CardDescription>
                            Update the details for this permission
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Permission Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="e.g., users.create, orders.view"
                                    required
                                />
                                <p className="text-sm text-muted-foreground">
                                    Use lowercase with dots (e.g.,
                                    resource.action). Only letters, numbers,
                                    dots, hyphens, and underscores allowed.
                                </p>
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
                                <p className="text-sm text-muted-foreground">
                                    The authentication guard this permission
                                    applies to (default: web)
                                </p>
                                {errors.guard_name && (
                                    <p className="text-sm text-red-600">
                                        {errors.guard_name}
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
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Permission'}
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
