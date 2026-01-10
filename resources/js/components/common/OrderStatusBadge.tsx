import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react';

type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'completed';

interface OrderStatusBadgeProps {
    status: OrderStatus | string;
    showIcon?: boolean;
    className?: string;
}

const statusConfig = {
    pending: {
        label: 'Pending',
        variant: 'outline' as const,
        icon: Clock,
        className: 'border-yellow-500 text-yellow-600',
    },
    confirmed: {
        label: 'Confirmed',
        variant: 'default' as const,
        icon: CheckCircle,
        className: 'bg-blue-600',
    },
    processing: {
        label: 'Processing',
        variant: 'default' as const,
        icon: Package,
        className: 'bg-purple-600',
    },
    shipped: {
        label: 'Shipped',
        variant: 'default' as const,
        icon: Truck,
        className: 'bg-indigo-600',
    },
    delivered: {
        label: 'Delivered',
        variant: 'default' as const,
        icon: CheckCircle,
        className: 'bg-green-600',
    },
    completed: {
        label: 'Completed',
        variant: 'default' as const,
        icon: CheckCircle,
        className: 'bg-green-700',
    },
    cancelled: {
        label: 'Cancelled',
        variant: 'destructive' as const,
        icon: XCircle,
        className: 'bg-red-600',
    },
};

export function OrderStatusBadge({
    status,
    showIcon = true,
    className = '',
}: OrderStatusBadgeProps) {
    const config = statusConfig[status as OrderStatus] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <Badge
            variant={config.variant}
            className={cn(config.className, className)}
        >
            {showIcon && <Icon className="mr-1 size-3" />}
            {config.label}
        </Badge>
    );
}
