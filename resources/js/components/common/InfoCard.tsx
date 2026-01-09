import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface InfoCardProps {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    children: ReactNode;
    className?: string;
    headerAction?: ReactNode;
}

export function InfoCard({
    title,
    description,
    icon: Icon,
    children,
    className = '',
    headerAction,
}: InfoCardProps) {
    return (
        <Card className={className}>
            {(title || description || headerAction) && (
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            {title && (
                                <CardTitle className="flex items-center gap-2">
                                    {Icon && <Icon className="h-5 w-5" />}
                                    {title}
                                </CardTitle>
                            )}
                            {description && (
                                <CardDescription className="mt-1.5">
                                    {description}
                                </CardDescription>
                            )}
                        </div>
                        {headerAction && <div>{headerAction}</div>}
                    </div>
                </CardHeader>
            )}
            <CardContent className={title || description ? '' : 'pt-6'}>
                {children}
            </CardContent>
        </Card>
    );
}
