import { DataTableActions, DataTableColumnHeader } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { edit as usersEdit, show as usersShow } from '@/routes/users';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Mail } from 'lucide-react';
import type { User } from './types';

interface UseUserColumnsProps {
    onDelete: (user: User) => void;
}

export function UseUserColumns({
    onDelete,
}: UseUserColumnsProps): ColumnDef<User>[] {
    return [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.original.name}</div>
            ),
        },
        {
            accessorKey: 'email',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{row.original.email}</span>
                </div>
            ),
        },
        {
            accessorKey: 'roles',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Roles"
                    sortable={false}
                />
            ),
            cell: ({ row }) => {
                const roles = row.original.roles;
                const visibleRoles = roles.slice(0, 3);
                const remainingCount = roles.length - 3;

                return (
                    <div className="flex flex-wrap items-center gap-1">
                        {roles.length > 0 ? (
                            <>
                                {visibleRoles.map((role) => (
                                    <Badge
                                        key={role}
                                        variant="outline"
                                        className="font-normal"
                                    >
                                        {role}
                                    </Badge>
                                ))}
                                {remainingCount > 0 && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge
                                                    variant="outline"
                                                    className="cursor-help font-normal"
                                                >
                                                    +{remainingCount}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-semibold">
                                                        Additional Roles:
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {roles
                                                            .slice(3)
                                                            .map((role) => (
                                                                <Badge
                                                                    key={role}
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {role}
                                                                </Badge>
                                                            ))}
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </>
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                No roles
                            </span>
                        )}
                    </div>
                );
            },
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
                    onEdit={() => router.visit(usersEdit(row.original.id).url)}
                    onView={() => router.visit(usersShow(row.original.id).url)}
                    onDelete={() => onDelete(row.original)}
                    showView={true}
                />
            ),
        },
    ];
}
