import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded' | 'partial';

interface PaymentStatusBadgeProps {
    status: PaymentStatus | string;
    showIcon?: boolean;
    className?: string;
}

const statusConfig = {
    paid: {
        label: 'Paid',
        variant: 'default' as const,
        icon: CheckCircle,
        className: 'bg-green-500 hover:bg-green-600',
    },
    pending: {
        label: 'Pending',
        variant: 'outline' as const,
        icon: Clock,
        className: 'border-yellow-500 text-yellow-600',
    },
    failed: {
        label: 'Failed',
        variant: 'destructive' as const,
        icon: XCircle,
        className: '',
    },
    refunded: {
        label: 'Refunded',
        variant: 'secondary' as const,
        icon: CheckCircle,
        className: '',
    },
    partial: {
        label: 'Partially Paid',
        variant: 'outline' as const,
        icon: Clock,
        className: 'border-blue-500 text-blue-600',
    },
};

export function PaymentStatusBadge({
    status,
    showIcon = true,
    className = '',
}: PaymentStatusBadgeProps) {
    const config =
        statusConfig[status as PaymentStatus] || statusConfig.pending;
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
