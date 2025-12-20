import { Badge } from '@/components/ui/badge';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, Shield } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
}

interface Role {
    name: string;
    label: string;
    permissions: string[];
}

interface Props {
    user: User;
    roles: Role[];
}

const breadcrumbs = (user: User): BreadcrumbItem[] => [
    {
        title: 'User Management',
        href: '/users',
    },
    {
        title: user.name,
        href: `/users/${user.id}`,
    },
    {
        title: 'Edit',
        href: `/users/${user.id}/edit`,
    },
];

export default function UsersEdit({ user, roles }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        roles: user.roles,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(user.id).url, {
            onSuccess: () => {
                window.location.href = index().url;
            },
        });
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
        <AppLayout breadcrumbs={breadcrumbs(user)}>
            <Head title={`Edit ${user.name}`} />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit User
                        </h1>
                        <p className="text-muted-foreground">
                            Update user information and roles
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>User Details</CardTitle>
                        <CardDescription>
                            Update the user information below
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Enter full name"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="Enter email address"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        New Password (Optional)
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        placeholder="Leave blank to keep current password"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Confirm new password"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-600">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {!data.roles.includes('Administrator') && (
                                <div className="space-y-4">
                                    <Label>Roles</Label>
                                    <TooltipProvider>
                                        <div className="grid max-h-96 gap-3 overflow-y-auto rounded-md border p-4">
                                            {roles.map((role) => (
                                                <div
                                                    key={role.name}
                                                    className="flex items-center space-x-2"
                                                >
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
                                                                Boolean(
                                                                    checked,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                    <div className="flex flex-1 items-center gap-2">
                                                        <Label
                                                            htmlFor={`role-${role.name}`}
                                                            className="cursor-pointer font-medium"
                                                        >
                                                            {role.label}
                                                        </Label>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Shield className="h-4 w-4 cursor-help text-muted-foreground" />
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-xs">
                                                                <div>
                                                                    <p className="mb-1 font-medium">
                                                                        Permissions
                                                                        (
                                                                        {
                                                                            role
                                                                                .permissions
                                                                                .length
                                                                        }
                                                                        )
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {role.permissions
                                                                            .slice(
                                                                                0,
                                                                                5,
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    permission,
                                                                                ) => (
                                                                                    <Badge
                                                                                        key={
                                                                                            permission
                                                                                        }
                                                                                        variant="outline"
                                                                                        className="text-xs"
                                                                                    >
                                                                                        {
                                                                                            permission
                                                                                        }
                                                                                    </Badge>
                                                                                ),
                                                                            )}
                                                                        {role
                                                                            .permissions
                                                                            .length >
                                                                            5 && (
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="text-xs"
                                                                            >
                                                                                +
                                                                                {role
                                                                                    .permissions
                                                                                    .length -
                                                                                    5}{' '}
                                                                                more
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TooltipProvider>
                                    {errors.roles && (
                                        <p className="text-sm text-red-600">
                                            {errors.roles}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'Saving...' : 'Save Changes'}
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
