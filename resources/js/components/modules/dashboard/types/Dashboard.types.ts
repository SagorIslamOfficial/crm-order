export interface DashboardStatistics {
    total_orders: number;
    pending_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    total_revenue: number;
    total_paid: number;
    total_due: number;
}

export interface DashboardFilters {
    date_from?: string;
    date_to?: string;
    shop_id?: string;
}
