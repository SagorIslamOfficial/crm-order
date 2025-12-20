import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { edit } from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Edit, Mail, Shield, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
    updated_at: string;
    email_verified_at: string | null;
}

interface Role {
    name: string;
    label: string;
    permissions_count: number;
}

interface Props {
    user: User;
    available_roles: Role[];
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
];

export default function UsersShow({ user, available_roles }: Props) {
    const [roles, setRoles] = useState<string[]>(user.roles);
    const [isLoading, setIsLoading] = useState(false);

    const handleAssignRole = (roleName: string) => {
        setIsLoading(true);
        router.post(
            `/users/${user.id}/roles/${roleName}`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRoles([...roles, roleName]);
                },
                onError: (errors) => {
                    console.error('Error assigning role:', errors);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(user)}>
            <Head title={`User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {user.name}
                            </h1>
                            <p className="text-muted-foreground">
                                User details and information
                            </p>
                        </div>
                    </div>
                    <Link href={edit(user.id).url}>
                        <Button className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit User
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* User Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Email Address
                                </Label>
                                <p className="text-sm">{user.email}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Email Verification
                                </Label>
                                <div className="mt-1 flex items-center gap-2">
                                    <Badge
                                        variant={
                                            user.email_verified_at
                                                ? 'default'
                                                : 'destructive'
                                        }
                                    >
                                        {user.email_verified_at
                                            ? 'Verified'
                                            : 'Unverified'}
                                    </Badge>
                                    {user.email_verified_at && (
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(
                                                user.email_verified_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Roles and Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Roles & Permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Assigned Roles */}
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                                    Assigned Roles ({roles.length})
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {roles.length > 0 ? (
                                        roles.map((role) => (
                                            <Badge
                                                key={role}
                                                variant="secondary"
                                                className="gap-1"
                                            >
                                                <ShieldCheck className="h-3 w-3" />
                                                {role}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No roles assigned
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Available Roles - Only show if user is not Administrator */}
                            {!roles.includes('Administrator') && (
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                                        Available Roles
                                    </Label>
                                    <div className="grid max-h-64 gap-3 overflow-y-auto">
                                        {available_roles
                                            .filter(
                                                (role) =>
                                                    !roles.includes(role.name),
                                            )
                                            .map((role) => (
                                                <div
                                                    key={role.name}
                                                    className="flex items-center justify-between rounded-lg border p-3"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {role.label}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                role.permissions_count
                                                            }{' '}
                                                            permission
                                                            {role.permissions_count !==
                                                            1
                                                                ? 's'
                                                                : ''}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleAssignRole(
                                                                role.name,
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                        className="gap-1"
                                                    >
                                                        <ShieldCheck className="h-3 w-3" />
                                                        Assign
                                                    </Button>
                                                </div>
                                            ))}
                                        {available_roles.filter(
                                            (role) =>
                                                !roles.includes(role.name),
                                        ).length === 0 && (
                                            <p className="py-4 text-center text-sm text-muted-foreground">
                                                All available roles are already
                                                assigned
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Account Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Account Created
                                </Label>
                                <p className="text-sm">
                                    {new Date(
                                        user.created_at,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Last Updated
                                </Label>
                                <p className="text-sm">
                                    {new Date(
                                        user.updated_at,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
