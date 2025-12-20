import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePermissions } from '@/hooks/usePermissions';
import AppLayout from '@/layouts/app-layout';
import { create, index, show } from '@/routes/permissions';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Shield, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface Permission {
    id: number;
    name: string;
    roles_count: number;
    users_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    permissions: {
        data: Permission[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    search: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permission Management',
        href: '/permissions',
    },
];

export default function PermissionsIndex({ permissions, search }: Props) {
    const { hasPermission } = usePermissions();
    const [searchTerm, setSearchTerm] = useState(search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            index().url,
            { search: searchTerm },
            { preserveState: true },
        );
    };

    const handleDelete = (permission: Permission) => {
        if (
            confirm(
                `Are you sure you want to delete the permission "${permission.name}"?`,
            )
        ) {
            router.delete(`/permissions/${permission.id}`, {
                onSuccess: () => {
                    // Refresh the page
                    window.location.reload();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permission Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Permission Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage system permissions and their assignments
                        </p>
                    </div>
                    {hasPermission('permissions.create') && (
                        <Link href={create().url}>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create Permission
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Permissions Table */}
                <Card>
                    <CardHeader>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search permissions..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="max-w-sm"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="outline"
                                className="gap-2"
                            >
                                <Search className="h-4 w-4" />
                                Search
                            </Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Roles</TableHead>
                                    <TableHead>Users</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="w-[100px]">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permissions.data.length > 0 ? (
                                    permissions.data.map((permission) => (
                                        <TableRow key={permission.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                                    {permission.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="gap-1"
                                                >
                                                    <Users className="h-3 w-3" />
                                                    {permission.roles_count}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="gap-1"
                                                >
                                                    <Users className="h-3 w-3" />
                                                    {permission.users_count}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    permission.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {hasPermission(
                                                        'permissions.view',
                                                    ) && (
                                                        <Link
                                                            href={
                                                                show(
                                                                    permission.id,
                                                                ).url
                                                            }
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {hasPermission(
                                                        'permissions.edit',
                                                    ) && (
                                                        <Link
                                                            href={`/permissions/${permission.id}/edit`}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {hasPermission(
                                                        'permissions.delete',
                                                    ) && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    permission,
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Shield className="h-8 w-8 text-muted-foreground" />
                                                <p className="text-muted-foreground">
                                                    No permissions found
                                                </p>
                                                {search && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Try adjusting your
                                                        search terms
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {permissions.last_page > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {permissions.from} to{' '}
                                    {permissions.to} of {permissions.total}{' '}
                                    permissions
                                </p>
                                <div className="flex gap-2">
                                    {permissions.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    index().url,
                                                    {
                                                        page:
                                                            permissions.current_page -
                                                            1,
                                                        search,
                                                    },
                                                    { preserveState: true },
                                                )
                                            }
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {permissions.current_page <
                                        permissions.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    index().url,
                                                    {
                                                        page:
                                                            permissions.current_page +
                                                            1,
                                                        search,
                                                    },
                                                    { preserveState: true },
                                                )
                                            }
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
