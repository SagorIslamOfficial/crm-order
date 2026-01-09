import { Dashboard } from '@/components/modules/dashboard';
import type { DashboardStatistics } from '@/components/modules/dashboard/types';
import { dashboard } from '@/routes';
import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import type { BreadcrumbItem, PageProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardPageProps extends PageProps {
    statistics: DashboardStatistics;
}

export default function DashboardPage({ statistics }: DashboardPageProps) {
    return (
        <MainPageLayout
            title="Dashboard"
            description="Overview of your order management system"
            breadcrumbs={breadcrumbs}
            useCard={false}
        >
            <Dashboard statistics={statistics} />
        </MainPageLayout>
    );
}
