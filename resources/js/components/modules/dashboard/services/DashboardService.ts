import { router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import type { DashboardFilters, DashboardStatistics } from '../types';

export class DashboardService {
    static async getStatistics(): Promise<DashboardStatistics> {
        try {
            const response = await fetch(dashboard().url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard statistics');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching dashboard statistics:', error);
            throw error;
        }
    }

    static async getStatisticsViaInertia(
        filters?: DashboardFilters,
    ): Promise<DashboardStatistics> {
        return new Promise((resolve, reject) => {
            router.get(
                dashboard().url,
                filters as Record<
                    string,
                    string | number | boolean | undefined
                >,
                {
                    onSuccess: (page) => {
                        resolve(page.props.statistics as DashboardStatistics);
                    },
                    onError: () => {
                        reject(
                            new Error('Failed to fetch dashboard statistics'),
                        );
                    },
                },
            );
        });
    }
}
