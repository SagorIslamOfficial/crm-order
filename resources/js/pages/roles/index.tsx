import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { create, edit, index, show } from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: string[];
    users_count: number;
    created_at: string;
}

interface RolesData {
    data: Role[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    roles: RolesData;
    search: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Management',
        href: '/roles',
    },
];

export default function RolesIndex({ roles, search }: Props) {
    const { hasPermission } = usePermissions();
    const [searchValue, setSearchValue] = useState(search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            index().url,
            { search: searchValue },
            { preserveState: true },
        );
    };

    const handleDelete = (roleId: number) => {
        router.delete(`/roles/${roleId}`, {
            onSuccess: () => {
                // Refresh the page data
                router.reload();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Role Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage system roles and their permissions
                        </p>
                    </div>
                    {hasPermission('roles.create') && (
                        <Link href={create().url}>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Role
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Search */}
                <Card>
                    <CardContent>
                        <form
                            onSubmit={handleSearch}
                            className="mb-6 flex gap-4"
                        >
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search roles by name..."
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
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

                        {/* Roles Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Users</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="w-[200px]">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-8 text-center"
                                            >
                                                <div className="text-muted-foreground">
                                                    No roles found
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        roles.data.map((role) => (
                                            <TableRow key={role.id}>
                                                <TableCell className="font-medium">
                                                    {role.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {role.permissions
                                                            .slice(0, 3)
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
                                                        {role.permissions
                                                            .length > 3 && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                +
                                                                {role
                                                                    .permissions
                                                                    .length -
                                                                    3}{' '}
                                                                more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {role.users_count}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        role.created_at,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {hasPermission(
                                                            'roles.view',
                                                        ) && (
                                                            <Link
                                                                href={
                                                                    show(
                                                                        role.id,
                                                                    ).url
                                                                }
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-1"
                                                                >
                                                                    <Eye className="h-3 w-3" />
                                                                    View
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        {hasPermission(
                                                            'roles.edit',
                                                        ) && (
                                                            <Link
                                                                href={
                                                                    edit(
                                                                        role.id,
                                                                    ).url
                                                                }
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-1"
                                                                >
                                                                    <Edit className="h-3 w-3" />
                                                                    Edit
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        {hasPermission(
                                                            'roles.delete',
                                                        ) &&
                                                            role.name !==
                                                                'Administrator' && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            role.id,
                                                                        )
                                                                    }
                                                                    className="gap-1 text-destructive hover:text-destructive"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                    Delete
                                                                </Button>
                                                            )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination would go here if needed */}
                        {roles.last_page > 1 && (
                            <div className="mt-4 flex justify-center">
                                <p className="text-sm text-muted-foreground">
                                    Pagination controls would be implemented
                                    here
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
