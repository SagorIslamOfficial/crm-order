import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface EmptyActionStateProps {
    message: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    buttonIcon?: ReactNode;
    icon?: ReactNode;
    className?: string;
}

export function EmptyActionState({
    message,
    description,
    buttonText,
    onButtonClick,
    buttonIcon,
    icon,
    className = '',
}: EmptyActionStateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
        >
            {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
            <p className="text-lg font-medium text-muted-foreground">
                {message}
            </p>
            {description && (
                <p className="mt-2 text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            {buttonText && onButtonClick && (
                <Button onClick={onButtonClick} className="mt-4" size="sm">
                    {buttonIcon}
                    {buttonText}
                </Button>
            )}
        </div>
    );
}
