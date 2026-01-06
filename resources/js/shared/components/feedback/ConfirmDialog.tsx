import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
    /**
     * Whether the dialog is open
     */
    open: boolean;

    /**
     * Callback when the dialog open state changes
     */
    onOpenChange: (open: boolean) => void;

    /**
     * Dialog title
     * @default "Are you sure?"
     */
    title?: string;

    /**
     * Dialog description
     * @default "This action cannot be undone."
     */
    description?: string;

    /**
     * Callback when the user confirms
     */
    onConfirm: () => void | Promise<void>;

    /**
     * Callback when the user cancels (optional, defaults to onOpenChange(false))
     */
    onCancel?: () => void;

    /**
     * Label for the confirm button
     * @default "Confirm"
     */
    confirmLabel?: string;

    /**
     * Label for the cancel button
     * @default "Cancel"
     */
    cancelLabel?: string;

    /**
     * Variant for the confirm button
     * @default "destructive"
     */
    confirmVariant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link';

    /**
     * Whether the confirm action is loading
     */
    loading?: boolean;

    /**
     * Whether to show a warning icon
     * @default true
     */
    showIcon?: boolean;
}

/**
 * Confirmation dialog component for destructive actions
 *
 * @example
 * // Basic delete confirmation
 * const [open, setOpen] = useState(false);
 *
 * <ConfirmDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Delete Order"
 *   description="Are you sure you want to delete this order? This action cannot be undone."
 *   onConfirm={handleDelete}
 * />
 *
 * @example
 * // With custom labels and variant
 * <ConfirmDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Archive Product"
 *   description="This product will be moved to the archive."
 *   confirmLabel="Archive"
 *   cancelLabel="Keep"
 *   confirmVariant="default"
 *   onConfirm={handleArchive}
 * />
 *
 * @example
 * // With loading state
 * <ConfirmDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Delete Customer"
 *   description="All orders associated with this customer will also be deleted."
 *   onConfirm={handleDelete}
 *   loading={isDeleting}
 * />
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmVariant = 'destructive',
    loading = false,
    showIcon = true,
}: ConfirmDialogProps) {
    const handleConfirm = async () => {
        await onConfirm();
        if (!loading) {
            onOpenChange(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    {showIcon && confirmVariant === 'destructive' && (
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    )}
                    <DialogTitle>{title}</DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={confirmVariant}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
