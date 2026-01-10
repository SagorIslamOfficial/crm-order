import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
    /**
     * Icon to display above the title
     */
    icon?: LucideIcon;

    /**
     * Main title text
     */
    title?: string;

    /**
     * Description text below the title
     */
    description?: string;

    /**
     * Call-to-action button or custom action element
     */
    action?: React.ReactNode;

    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Empty state component for displaying when no data is available
 *
 * @example
 * // Simple text-only
 * <EmptyState title="No orders found" />
 *
 * @example
 * // With icon and description
 * <EmptyState
 *   icon={Package}
 *   title="No orders found"
 *   description="Create your first order to get started"
 * />
 *
 * @example
 * // With action button
 * <EmptyState
 *   icon={ShoppingBag}
 *   title="No products"
 *   description="Add products to your inventory"
 *   action={
 *     <Link href="/products/create">
 *       <Button>
 *         <Plus className="h-4 w-4" />
 *         Add Product
 *       </Button>
 *     </Link>
 *   }
 * />
 */
export function EmptyState({
    icon: Icon,
    title = 'No data found',
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center p-8 text-center',
                className,
            )}
        >
            {Icon && (
                <div className="mb-4 rounded-full bg-muted p-3">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
            )}

            {title && (
                <h3 className="mb-1 text-sm font-medium text-foreground">
                    {title}
                </h3>
            )}

            {description && (
                <p className="mb-4 text-sm text-muted-foreground">
                    {description}
                </p>
            )}

            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
