/**
 * Date utility functions for consistent date formatting across the application
 */

/**
 * Format date for display (e.g., "Jan 15, 2026")
 */
export function formatDateForDisplay(
    date: string | Date | null | undefined,
): string {
    if (!date) return '-';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(dateObj);
}

/**
 * Format date and time for display (e.g., "Jan 15, 2026, 2:30 PM")
 */
export function formatDateTimeForDisplay(
    date: string | Date | null | undefined,
): string {
    if (!date) return '-';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(dateObj);
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(
    date: string | Date | null | undefined,
): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toISOString().split('T')[0];
}

/**
 * Format time for display (e.g., "2:30 PM")
 */
export function formatTimeForDisplay(
    time: string | Date | null | undefined,
): string {
    if (!time) return '-';

    const dateObj = typeof time === 'string' ? new Date(time) : time;

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(dateObj);
}

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(
    date: string | Date | null | undefined,
): string {
    if (!date) return '-';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSecs < 60) return 'just now';
    if (diffInMins < 60)
        return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
    if (diffInHours < 24)
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 30)
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return formatDateForDisplay(dateObj);
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date | null | undefined): boolean {
    if (!date) return false;

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();

    return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
    );
}

/**
 * Check if date is in the past
 */
export function isPast(date: string | Date | null | undefined): boolean {
    if (!date) return false;

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date();
}
