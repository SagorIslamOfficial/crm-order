import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Banknote,
    CheckCircle2,
    Clock,
    ShoppingBag,
    TrendingUp,
    XCircle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Statistics {
    total_orders: number;
    pending_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    total_revenue: string;
    total_paid: string;
    total_due: string;
}

interface DashboardProps extends PageProps {
    statistics: Statistics;
}

export default function Dashboard({ statistics }: DashboardProps) {
    const formatCurrency = (amount: string) => {
        return `৳${parseFloat(amount).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Overview of your order management system
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Orders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Orders
                            </CardTitle>
                            <ShoppingBag className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.total_orders}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All time orders
                            </p>
                        </CardContent>
                    </Card>

                    {/* Pending Orders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Orders
                            </CardTitle>
                            <Clock className="size-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.pending_orders}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting processing
                            </p>
                        </CardContent>
                    </Card>

                    {/* Delivered Orders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Delivered Orders
                            </CardTitle>
                            <CheckCircle2 className="size-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.delivered_orders}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Successfully completed
                            </p>
                        </CardContent>
                    </Card>

                    {/* Cancelled Orders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Cancelled Orders
                            </CardTitle>
                            <XCircle className="size-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.cancelled_orders}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Orders cancelled
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Revenue Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Total Revenue */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <TrendingUp className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(statistics.total_revenue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total order value
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Paid */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Paid
                            </CardTitle>
                            <Banknote className="size-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(statistics.total_paid)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Payments received
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Due */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Due
                            </CardTitle>
                            <Banknote className="size-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {formatCurrency(statistics.total_due)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Outstanding balance
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
