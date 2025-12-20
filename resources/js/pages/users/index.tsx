import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePermissions } from '@/hooks/usePermissions';
import AppLayout from '@/layouts/app-layout';
import { create, edit, index, show } from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Edit,
    Eye,
    Plus,
    Search,
    Trash2,
    UserCheck,
    UserX,
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
    email_verified_at: string | null;
}

interface UsersData {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    users: UsersData;
    search: string;
    roles: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/users',
    },
];

export default function UsersIndex({ users, search, roles }: Props) {
    const { hasPermission } = usePermissions();
    const [searchValue, setSearchValue] = useState(search || '');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [bulkActionRole, setBulkActionRole] = useState<string>('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            index().url,
            { search: searchValue },
            { preserveState: true },
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(users.data.map((user) => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: string, checked: boolean) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        }
    };

    const handleBulkAssignRole = () => {
        if (!bulkActionRole || selectedUsers.length === 0) return;

        // This would need a backend endpoint for bulk role assignment
        // For now, we'll show an alert
        alert(
            `Assigning role "${bulkActionRole}" to ${selectedUsers.length} users`,
        );
        setSelectedUsers([]);
        setBulkActionRole('');
    };

    const handleBulkRemoveRole = () => {
        if (!bulkActionRole || selectedUsers.length === 0) return;

        // This would need a backend endpoint for bulk role removal
        alert(
            `Removing role "${bulkActionRole}" from ${selectedUsers.length} users`,
        );
        setSelectedUsers([]);
        setBulkActionRole('');
    };

    const handleDelete = (userId: string) => {
        router.delete(`/users/${userId}`, {
            onSuccess: () => {
                // Refresh the page data
                router.reload();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            User Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage system users and their roles
                        </p>
                    </div>
                    {hasPermission('users.create') && (
                        <Link href={create().url}>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add User
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
                                    placeholder="Search users by name or email..."
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

                        {/* Bulk Actions */}
                        {selectedUsers.length > 0 &&
                            hasPermission('users.edit') && (
                                <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
                                    <span className="text-sm font-medium">
                                        {selectedUsers.length} user
                                        {selectedUsers.length !== 1
                                            ? 's'
                                            : ''}{' '}
                                        selected
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={bulkActionRole}
                                            onChange={(e) =>
                                                setBulkActionRole(
                                                    e.target.value,
                                                )
                                            }
                                            className="rounded-md border bg-background px-3 py-1 text-sm"
                                        >
                                            <option value="">
                                                Select role...
                                            </option>
                                            {roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            size="sm"
                                            onClick={handleBulkAssignRole}
                                            disabled={!bulkActionRole}
                                            className="gap-1"
                                        >
                                            <UserCheck className="h-3 w-3" />
                                            Assign Role
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleBulkRemoveRole}
                                            disabled={!bulkActionRole}
                                            className="gap-1"
                                        >
                                            <UserX className="h-3 w-3" />
                                            Remove Role
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setSelectedUsers([])}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                            )}

                        {/* Users Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {hasPermission('users.edit') && (
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={
                                                        selectedUsers.length ===
                                                            users.data.length &&
                                                        users.data.length > 0
                                                    }
                                                    onCheckedChange={
                                                        handleSelectAll
                                                    }
                                                />
                                            </TableHead>
                                        )}
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Roles</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="w-[200px]">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={
                                                    hasPermission('users.edit')
                                                        ? 6
                                                        : 5
                                                }
                                                className="py-8 text-center"
                                            >
                                                <div className="text-muted-foreground">
                                                    No users found
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((user) => (
                                            <TableRow key={user.id}>
                                                {hasPermission(
                                                    'users.edit',
                                                ) && (
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedUsers.includes(
                                                                user.id,
                                                            )}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) =>
                                                                handleSelectUser(
                                                                    user.id,
                                                                    Boolean(
                                                                        checked,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                )}
                                                <TableCell className="font-medium">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell>
                                                    {user.email}
                                                </TableCell>
                                                <TableCell>
                                                    <TooltipProvider>
                                                        <div className="flex flex-wrap gap-1">
                                                            {user.roles.map(
                                                                (role) => (
                                                                    <Tooltip
                                                                        key={
                                                                            role
                                                                        }
                                                                    >
                                                                        <TooltipTrigger>
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="cursor-help"
                                                                            >
                                                                                {
                                                                                    role
                                                                                }
                                                                            </Badge>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>
                                                                                Click
                                                                                to
                                                                                view
                                                                                role
                                                                                details
                                                                            </p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                ),
                                                            )}
                                                        </div>
                                                    </TooltipProvider>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {hasPermission(
                                                            'users.view',
                                                        ) && (
                                                            <Link
                                                                href={
                                                                    show(
                                                                        user.id,
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
                                                            'users.edit',
                                                        ) && (
                                                            <Link
                                                                href={
                                                                    edit(
                                                                        user.id,
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
                                                            'users.delete',
                                                        ) && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user.id,
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
                        {users.last_page > 1 && (
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
