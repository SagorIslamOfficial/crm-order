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
import { edit } from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit, Users } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: string[];
    users: User[];
    created_at: string;
    updated_at: string;
}

interface Props {
    role: Role;
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
];

export default function RolesShow({ role }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(role)}>
            <Head title={role.name} />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="flex w-full items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {role.name}
                            </h1>
                            <p className="text-muted-foreground">
                                Role details and assigned users
                            </p>
                        </div>
                        <Link href={edit(role.id).url}>
                            <Button className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Role
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Role Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Information</CardTitle>
                            <CardDescription>
                                Basic details about this role
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">
                                    Name
                                </Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {role.name}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Guard Name
                                </Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {role.guard_name}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Created
                                </Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {new Date(
                                        role.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Last Updated
                                </Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {new Date(
                                        role.updated_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                            <CardDescription>
                                Permissions assigned to this role
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {role.permissions.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map((permission) => (
                                        <Badge
                                            key={permission}
                                            variant="secondary"
                                        >
                                            {permission}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No permissions assigned
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Assigned Users */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Assigned Users ({role.users.length})
                        </CardTitle>
                        <CardDescription>
                            Users who have been assigned this role
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {role.users.length > 0 ? (
                            <div className="space-y-4">
                                {role.users.map((user) => (
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
                                No users have been assigned this role
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
