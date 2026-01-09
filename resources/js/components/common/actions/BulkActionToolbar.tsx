import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React from 'react';

interface BulkActionToolbarProps {
    selectedCount: number;
    onClearSelection: () => void;
    actions?: React.ReactNode;
    customInputs?: React.ReactNode;
    className?: string;
}

export function BulkActionToolbar({
    selectedCount,
    onClearSelection,
    actions,
    customInputs,
    className,
}: BulkActionToolbarProps) {
    if (selectedCount === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                'flex items-center gap-4 rounded-lg border bg-muted/50 p-4',
                className,
            )}
        >
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onClearSelection}
                    title="Clear selection"
                >
                    <X className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                    {selectedCount} item{selectedCount !== 1 ? 's' : ''}{' '}
                    selected
                </span>
            </div>

            {customInputs && (
                <div className="flex items-center gap-2">{customInputs}</div>
            )}

            {actions && (
                <div className="flex items-center gap-2">{actions}</div>
            )}
        </div>
    );
}
