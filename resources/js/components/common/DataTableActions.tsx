import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Edit, Eye, Trash } from 'lucide-react';
import { PermissionGuard } from './PermissionGuard';

interface DataTableActionsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
    editLabel?: string;
    deleteLabel?: string;
    viewLabel?: string;
    showEdit?: boolean;
    showDelete?: boolean;
    showView?: boolean;
    className?: string;
    editPermission?: string | string[];
    deletePermission?: string | string[];
    viewPermission?: string | string[];
}

export function DataTableActions({
    onEdit,
    onDelete,
    onView,
    editLabel = 'Edit',
    deleteLabel = 'Delete',
    viewLabel = 'View',
    showEdit = true,
    showDelete = true,
    showView = true,
    className,
    editPermission,
    deletePermission,
    viewPermission,
}: DataTableActionsProps) {
    return (
        <div className={cn('flex items-center justify-end gap-2', className)}>
            {showView && onView && (
                <PermissionGuard permission={viewPermission}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onView}
                        title={viewLabel}
                    >
                        <Eye className="size-4" />
                    </Button>
                </PermissionGuard>
            )}
            {showEdit && onEdit && (
                <PermissionGuard permission={editPermission}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        title={editLabel}
                    >
                        <Edit className="size-4" />
                    </Button>
                </PermissionGuard>
            )}
            {showDelete && onDelete && (
                <PermissionGuard permission={deletePermission}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        title={deleteLabel}
                    >
                        <Trash className="size-4" />
                    </Button>
                </PermissionGuard>
            )}
        </div>
    );
}
