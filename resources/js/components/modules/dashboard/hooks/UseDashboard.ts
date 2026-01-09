import { useCallback, useState } from 'react';
import { DashboardService } from '../services/DashboardService';
import type { DashboardStatistics } from '../types';

export function useDashboard() {
    const [statistics, setStatistics] = useState<DashboardStatistics | null>(
        null,
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await DashboardService.getStatisticsViaInertia();
            setStatistics(data);
            return data;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch dashboard statistics';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        statistics,
        loading,
        error,
        fetchStatistics,
    };
}
