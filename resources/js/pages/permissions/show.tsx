import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { edit } from '@/routes/permissions';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit, Shield, ShieldCheck, Users } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: string;
    name: string;
    email: string;
}

interface Permission {
    id: number;
    name: string;
    roles_count: number;
    users_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    permission: Permission;
    roles: Role[];
    users: User[];
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
];

export default function PermissionsShow({ permission, roles, users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(permission)}>
            <Head title={permission.name} />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="flex w-full items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {permission.name}
                            </h1>
                            <p className="text-muted-foreground">
                                Permission details and assignments
                            </p>
                        </div>
                        <Link href={edit(permission.id).url}>
                            <Button className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Permission
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Permission Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Permission Information
                            </CardTitle>
                            <CardDescription>
                                Basic details about this permission
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">
                                    Name
                                </Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {permission.name}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Roles Assigned
                                </Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {permission.roles_count} role
                                    {permission.roles_count !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Users Assigned
                                </Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {permission.users_count} user
                                    {permission.users_count !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Created
                                </Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {new Date(
                                        permission.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Last Updated
                                </Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {new Date(
                                        permission.updated_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Usage Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5" />
                                Usage Statistics
                            </CardTitle>
                            <CardDescription>
                                How this permission is currently used
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    Total Assignments
                                </span>
                                <Badge variant="secondary">
                                    {permission.roles_count +
                                        permission.users_count}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    Via Roles
                                </span>
                                <Badge variant="outline">
                                    {permission.roles_count}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    Direct to Users
                                </span>
                                <Badge variant="outline">
                                    {permission.users_count}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Assigned Roles */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Assigned Roles ({roles.length})
                        </CardTitle>
                        <CardDescription>
                            Roles that have been granted this permission
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {roles.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {roles.map((role) => (
                                    <Link
                                        key={role.id}
                                        href={`/roles/${role.id}`}
                                    >
                                        <Badge
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-secondary/80"
                                        >
                                            {role.name}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No roles have been assigned this permission
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Assigned Users */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Assigned Users ({users.length})
                        </CardTitle>
                        <CardDescription>
                            Users who have been directly granted this permission
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {users.length > 0 ? (
                            <div className="space-y-4">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link href={`/users/${user.id}`}>
                                            <Button variant="outline" size="sm">
                                                View User
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No users have been directly assigned this
                                permission
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
