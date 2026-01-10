/**
 * Array utility functions for data manipulation
 */

/**
 * Group array items by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
        (result, item) => {
            const groupKey = String(item[key]);
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        },
        {} as Record<string, T[]>,
    );
}

/**
 * Sort array by a key
 */
export function sortBy<T>(
    array: T[],
    key: keyof T,
    direction: 'asc' | 'desc' = 'asc',
): T[] {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
    return Array.from(new Set(array));
}

/**
 * Remove duplicates by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
    const seen = new Set();
    return array.filter((item) => {
        const k = item[key];
        if (seen.has(k)) {
            return false;
        }
        seen.add(k);
        return true;
    });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

/**
 * Sum array values by key
 */
export function sumBy<T>(array: T[], key: keyof T): number {
    return array.reduce((sum, item) => sum + Number(item[key]), 0);
}

/**
 * Calculate average
 */
export function average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Convert array to paginated data structure
 */
export function arrayToPaginatedData<T>(
    items: T[],
    perPage: number = 10,
    currentPage: number = 1,
) {
    const total = items.length;
    const lastPage = Math.ceil(total / perPage);
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);
    const data = items.slice(from - 1, to);

    return {
        data,
        current_page: currentPage,
        from: total > 0 ? from : null,
        last_page: lastPage,
        per_page: perPage,
        to: total > 0 ? to : null,
        total,
        links: [],
        next_page_url: currentPage < lastPage ? '#' : null,
        prev_page_url: currentPage > 1 ? '#' : null,
        path: '',
    };
}
