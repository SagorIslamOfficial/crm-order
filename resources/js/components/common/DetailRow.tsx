import { ReactNode } from 'react';

interface DetailRowProps {
    label: string;
    value: ReactNode;
    className?: string;
}

export function DetailRow({ label, value, className = '' }: DetailRowProps) {
    return (
        <div className={`flex items-start justify-between py-1 ${className}`}>
            <span className="pr-4 text-sm whitespace-nowrap text-muted-foreground">
                {label}
            </span>
            <div className="max-w-[70%] text-right text-sm font-medium break-words">
                {value || '-'}
            </div>
        </div>
    );
}
