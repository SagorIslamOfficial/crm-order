import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import type { Filters } from '../types';

export function useFilters<T extends Filters = Filters>(
    initialFilters: T = {} as T,
) {
    const [filters, setFilters] = useState<T>(initialFilters);

    const updateFilters = useCallback((newFilters: Partial<T>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const applyFilters = useCallback(
        (url: string) => {
            router.get(
                url,
                { ...filters } as unknown as Record<
                    string,
                    string | number | undefined
                >,
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['data', 'meta'],
                },
            );
        },
        [filters],
    );

    return {
        filters,
        updateFilters,
        resetFilters,
        applyFilters,
    };
}
