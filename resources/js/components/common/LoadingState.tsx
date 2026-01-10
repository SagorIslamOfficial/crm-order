import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    /**
     * Variant of the loading state
     * - 'spinner': Animated spinner with text
     * - 'skeleton': Skeleton loader (useful for lists)
     * @default 'spinner'
     */
    variant?: 'spinner' | 'skeleton';

    /**
     * Text to display below the spinner
     * @default 'Loading...'
     */
    text?: string;

    /**
     * Number of skeleton rows to display (only for skeleton variant)
     * @default 3
     */
    rows?: number;

    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Loading state component for displaying loading indicators
 *
 * @example
 * // Simple spinner
 * <LoadingState />
 *
 * @example
 * // Custom text
 * <LoadingState text="Loading orders..." />
 *
 * @example
 * // Skeleton loader for tables
 * <LoadingState variant="skeleton" rows={5} />
 */
export function LoadingState({
    variant = 'spinner',
    text = 'Loading...',
    rows = 3,
    className,
}: LoadingStateProps) {
    if (variant === 'skeleton') {
        return (
            <div className={cn('space-y-3', className)}>
                {Array.from({ length: rows }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className={cn('flex h-32 items-center justify-center', className)}>
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{text}</p>
            </div>
        </div>
    );
}
