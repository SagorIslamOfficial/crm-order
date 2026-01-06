import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface CustomerActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export function CustomerActions({ onEdit, onDelete }: CustomerActionsProps) {
    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="mr-2 size-4" />
                Edit Customer
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="text-destructive hover:text-destructive"
            >
                <Trash2 className="mr-2 size-4" />
                Delete
            </Button>
        </div>
    );
}
