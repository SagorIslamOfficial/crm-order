import { cn } from '@/lib/utils';

interface PriceDisplayProps {
    amount: number;
    currency?: string;
    className?: string;
    showCurrency?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({
    amount,
    currency = 'BDT',
    className = '',
    showCurrency = true,
    size = 'md',
}: PriceDisplayProps) {
    // Format number with commas
    const formattedNumber = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    // Use ৳ symbol for BDT, otherwise use currency code
    const currencySymbol = currency === 'BDT' ? '৳' : currency;

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg font-semibold',
    };

    return (
        <span className={cn('font-mono', sizeClasses[size], className)}>
            {showCurrency
                ? `${currencySymbol}${formattedNumber}`
                : formattedNumber}
        </span>
    );
}
