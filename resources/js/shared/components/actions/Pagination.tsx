import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    /**
     * Array of pagination links from Laravel paginator
     */
    links: PaginationLink[];

    /**
     * Additional CSS classes for the container
     */
    className?: string;

    /**
     * Whether to show info text (e.g., "Showing 1 to 10 of 50 results")
     */
    showInfo?: boolean;

    /**
     * Current page number (for info text)
     */
    currentPage?: number;

    /**
     * Items per page (for info text)
     */
    perPage?: number;

    /**
     * Total number of items (for info text)
     */
    total?: number;
}

/**
 * Pagination component integrated with Inertia.js for Laravel pagination
 *
 * @example
 * // Basic usage with Laravel paginated data
 * <Pagination links={orders.links} />
 *
 * @example
 * // With info text
 * <Pagination
 *   links={orders.links}
 *   showInfo
 *   currentPage={orders.current_page}
 *   perPage={orders.per_page}
 *   total={orders.total}
 * />
 *
 * @example
 * // Custom styling
 * <Pagination
 *   links={orders.links}
 *   className="border-t pt-4"
 * />
 */
export function Pagination({
    links,
    className,
    showInfo = false,
    currentPage,
    perPage,
    total,
}: PaginationProps) {
    if (!links || links.length <= 3) {
        return null;
    }

    const from =
        currentPage && perPage ? (currentPage - 1) * perPage + 1 : null;
    const to =
        currentPage && perPage && total
            ? Math.min(currentPage * perPage, total)
            : null;

    return (
        <div className={cn('flex items-center justify-between', className)}>
            {showInfo && from && to && total ? (
                <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{from}</span> to{' '}
                    <span className="font-medium">{to}</span> of{' '}
                    <span className="font-medium">{total}</span> results
                </div>
            ) : (
                <div /> // Spacer for flex layout
            )}

            <div className="flex items-center gap-2">
                {links.map((link, index) => {
                    // Skip if no URL (disabled state)
                    if (!link.url) {
                        return (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                disabled
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    return (
                        <Link key={index} href={link.url} preserveScroll>
                            <Button
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
