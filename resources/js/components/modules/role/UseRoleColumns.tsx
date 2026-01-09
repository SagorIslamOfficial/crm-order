import { DataTableActions, DataTableColumnHeader } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { edit as rolesEdit, show as rolesShow } from '@/routes/roles';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Shield, Users } from 'lucide-react';
import type { Role } from './types';

interface UseRoleColumnsProps {
    onDelete: (role: Role) => void;
}

export function UseRoleColumns({
    onDelete,
}: UseRoleColumnsProps): ColumnDef<Role>[] {
    return [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Role Name" />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2 font-medium">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    {row.original.name}
                </div>
            ),
        },
        {
            accessorKey: 'permissions',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Permissions"
                    sortable={false}
                />
            ),
            cell: ({ row }) => {
                const permissions = row.original.permissions;
                const visiblePermissions = permissions.slice(0, 3);
                const remainingCount = permissions.length - 3;

                return (
                    <div className="flex flex-wrap items-center gap-1">
                        {permissions.length > 0 ? (
                            <>
                                {visiblePermissions.map((permission) => (
                                    <Badge
                                        key={permission}
                                        variant="outline"
                                        className="text-xs font-normal"
                                    >
                                        {permission}
                                    </Badge>
                                ))}
                                {remainingCount > 0 && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge
                                                    variant="outline"
                                                    className="cursor-help text-xs font-normal"
                                                >
                                                    +{remainingCount}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-semibold">
                                                        Additional Permissions:
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {permissions
                                                            .slice(3)
                                                            .map(
                                                                (
                                                                    permission,
                                                                ) => (
                                                                    <Badge
                                                                        key={
                                                                            permission
                                                                        }
                                                                        variant="secondary"
                                                                        className="text-xs"
                                                                    >
                                                                        {
                                                                            permission
                                                                        }
                                                                    </Badge>
                                                                ),
                                                            )}
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </>
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                No permissions
                            </span>
                        )}
                    </div>
                );
            },
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
                <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{row.original.users_count}</span>
                </div>
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
                    onEdit={() => router.visit(rolesEdit(row.original.id).url)}
                    onView={() => router.visit(rolesShow(row.original.id).url)}
                    onDelete={() => onDelete(row.original)}
                    showView={true}
                    showDelete={row.original.name !== 'Administrator'}
                />
            ),
        },
    ];
}
