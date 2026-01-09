import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const statusBadgeVariants = cva(
    'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                // Order Status Variants
                pending:
                    'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                processing:
                    'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                delivered:
                    'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                cancelled:
                    'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',

                // Payment Method Variants
                cash: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
                bkash: 'border-transparent bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
                nagad: 'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
                bank: 'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',

                // Generic Status Variants
                success:
                    'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                error: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                warning:
                    'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                info: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',

                // Active/Inactive Variants
                active: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                inactive:
                    'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',

                // Default Variants (matching Badge component)
                default:
                    'border-transparent bg-primary text-primary-foreground',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground',
                destructive: 'border-transparent bg-destructive text-white',
                outline: 'text-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface StatusBadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof statusBadgeVariants> {
    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Badge content (text or elements)
     */
    children: React.ReactNode;
}

/**
 * Status badge component with comprehensive variant system for orders, payments, and generic statuses
 *
 * @example
 * // Order status
 * <StatusBadge variant="pending">Pending</StatusBadge>
 * <StatusBadge variant="delivered">Delivered</StatusBadge>
 * <StatusBadge variant="cancelled">Cancelled</StatusBadge>
 *
 * @example
 * // Payment method
 * <StatusBadge variant="cash">Cash</StatusBadge>
 * <StatusBadge variant="bkash">bKash</StatusBadge>
 * <StatusBadge variant="nagad">Nagad</StatusBadge>
 *
 * @example
 * // Generic status
 * <StatusBadge variant="success">Success</StatusBadge>
 * <StatusBadge variant="error">Error</StatusBadge>
 * <StatusBadge variant="warning">Warning</StatusBadge>
 *
 * @example
 * // Active/Inactive
 * <StatusBadge variant="active">Active</StatusBadge>
 * <StatusBadge variant="inactive">Inactive</StatusBadge>
 *
 * @example
 * // With custom className
 * <StatusBadge variant="pending" className="uppercase">
 *   Pending
 * </StatusBadge>
 */
export function StatusBadge({
    variant,
    className,
    children,
    ...props
}: StatusBadgeProps) {
    return (
        <div
            className={cn(statusBadgeVariants({ variant }), className)}
            {...props}
        >
            {children}
        </div>
    );
}
