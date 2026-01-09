import { Button } from '@/components/ui/button';

interface FormActionsProps {
    onCancel?: () => void;
    isProcessing?: boolean;
    submitLabel?: string;
    cancelLabel?: string;
    className?: string;
}

export function FormActions({
    onCancel,
    isProcessing = false,
    submitLabel = 'Save',
    cancelLabel = 'Cancel',
    className = '',
}: FormActionsProps) {
    return (
        <div className={`flex items-center justify-end gap-4 ${className}`}>
            {onCancel && (
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isProcessing}
                >
                    {cancelLabel}
                </Button>
            )}
            <Button type="submit" disabled={isProcessing} variant="default">
                {submitLabel}
            </Button>
        </div>
    );
}
