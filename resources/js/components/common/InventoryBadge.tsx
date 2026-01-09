import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

type InventoryStatus =
    | 'in_stock'
    | 'low_stock'
    | 'out_of_stock'
    | 'discontinued';

interface InventoryBadgeProps {
    status: InventoryStatus | string;
    quantity?: number;
    showIcon?: boolean;
    className?: string;
}

const statusConfig = {
    in_stock: {
        label: 'In Stock',
        variant: 'default' as const,
        icon: CheckCircle,
        className: 'bg-green-500 hover:bg-green-600',
    },
    low_stock: {
        label: 'Low Stock',
        variant: 'outline' as const,
        icon: AlertCircle,
        className: 'border-orange-500 text-orange-600',
    },
    out_of_stock: {
        label: 'Out of Stock',
        variant: 'destructive' as const,
        icon: XCircle,
        className: '',
    },
    discontinued: {
        label: 'Discontinued',
        variant: 'secondary' as const,
        icon: Clock,
        className: '',
    },
};

export function InventoryBadge({
    status,
    quantity,
    showIcon = true,
    className = '',
}: InventoryBadgeProps) {
    const config =
        statusConfig[status as InventoryStatus] || statusConfig.out_of_stock;
    const Icon = config.icon;

    return (
        <Badge
            variant={config.variant}
            className={cn(config.className, className)}
        >
            {showIcon && <Icon className="mr-1 size-3" />}
            {config.label}
            {quantity !== undefined && ` (${quantity})`}
        </Badge>
    );
}
