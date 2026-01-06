import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';

export interface InfoItem {
    label: string;
    value: ReactNode;
    hidden?: boolean;
}

interface InfoCardProps {
    title: string;
    description?: string;
    items: InfoItem[];
    children?: ReactNode;
}

export function InfoCard({
    title,
    description,
    items,
    children,
}: InfoCardProps) {
    const visibleItems = items.filter((item) => !item.hidden);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardHeader>
            <CardContent className="space-y-2">
                {visibleItems.map((item, index) => (
                    <div key={index}>
                        <p className="text-sm text-muted-foreground">
                            {item.label}
                        </p>
                        <div className="font-medium">{item.value}</div>
                    </div>
                ))}
                {children}
            </CardContent>
        </Card>
    );
}
