import type { DashboardStatistics } from '../types';
import { StatisticsGrid } from './StatisticsGrid';

interface DashboardProps {
    statistics: DashboardStatistics;
}

export function Dashboard({ statistics }: DashboardProps) {
    return (
        <div className="space-y-6">
            <StatisticsGrid statistics={statistics} />
        </div>
    );
}
