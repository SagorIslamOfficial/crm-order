import { DataTableActions, DataTableColumnHeader } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import {
    edit as permissionsEdit,
    show as permissionsShow,
} from '@/routes/permissions';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Shield, Users } from 'lucide-react';
import type { Permission } from './types';

interface UsePermissionColumnsProps {
    onDelete: (permission: Permission) => void;
}

export function UsePermissionColumns({
    onDelete,
}: UsePermissionColumnsProps): ColumnDef<Permission>[] {
    return [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Permission Name"
                />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2 font-medium">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    {row.original.name}
                </div>
            ),
        },
        {
            accessorKey: 'guard_name',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Guard" />
            ),
            cell: ({ row }) => (
                <Badge variant="outline">{row.original.guard_name}</Badge>
            ),
        },
        {
            accessorKey: 'roles_count',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Roles"
                    sortable={false}
                />
            ),
            cell: ({ row }) => (
                <Badge variant="secondary" className="gap-1">
                    <Users className="h-3 w-3" />
                    {row.original.roles_count}
                </Badge>
            ),
        },
        {
            accessorKey: 'users_count',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Users"
                    sortable={false}
                />
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="gap-1">
                    <Users className="h-3 w-3" />
                    {row.original.users_count}
                </Badge>
            ),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created" />
            ),
            cell: ({ row }) => (
                <div className="text-sm">
                    {new Date(row.original.created_at).toLocaleDateString()}
                </div>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <DataTableActions
                    onEdit={() =>
                        router.get(permissionsEdit(row.original.id).url)
                    }
                    onView={() =>
                        router.get(permissionsShow(row.original.id).url)
                    }
                    onDelete={() => onDelete(row.original)}
                    showView={true}
                    viewPermission="permissions.view"
                    editPermission="permissions.edit"
                    deletePermission="permissions.delete"
                />
            ),
        },
    ];
}
