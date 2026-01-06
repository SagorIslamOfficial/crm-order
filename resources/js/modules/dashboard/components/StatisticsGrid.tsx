import {
    Banknote,
    CheckCircle2,
    Clock,
    ShoppingBag,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import type { DashboardStatistics } from '../types';
import { StatisticsCard } from './StatisticsCard';

interface StatisticsGridProps {
    statistics: DashboardStatistics;
}

const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export function StatisticsGrid({ statistics }: StatisticsGridProps) {
    return (
        <div className="space-y-6">
            {/* Order Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatisticsCard
                    title="Total Orders"
                    value={statistics.total_orders}
                    description="All time orders"
                    icon={ShoppingBag}
                />

                <StatisticsCard
                    title="Pending Orders"
                    value={statistics.pending_orders}
                    description="Awaiting processing"
                    icon={Clock}
                    iconColor="text-yellow-600"
                />

                <StatisticsCard
                    title="Delivered Orders"
                    value={statistics.delivered_orders}
                    description="Successfully completed"
                    icon={CheckCircle2}
                    iconColor="text-green-600"
                />

                <StatisticsCard
                    title="Cancelled Orders"
                    value={statistics.cancelled_orders}
                    description="Orders cancelled"
                    icon={XCircle}
                    iconColor="text-red-600"
                />
            </div>

            {/* Revenue Statistics */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatisticsCard
                    title="Total Revenue"
                    value={formatCurrency(statistics.total_revenue)}
                    description="Total order value"
                    icon={TrendingUp}
                />

                <StatisticsCard
                    title="Total Paid"
                    value={formatCurrency(statistics.total_paid)}
                    description="Payments received"
                    icon={Banknote}
                    iconColor="text-green-600"
                    valueColor="text-green-600"
                />

                <StatisticsCard
                    title="Total Due"
                    value={formatCurrency(statistics.total_due)}
                    description="Outstanding balance"
                    icon={Banknote}
                    iconColor="text-orange-600"
                    valueColor="text-orange-600"
                />
            </div>
        </div>
    );
}
