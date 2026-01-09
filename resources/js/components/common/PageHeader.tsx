import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    backUrl?: string;
    backLabel?: string;
    editUrl?: string;
    actions?: ReactNode;
    action?: {
        label: string;
        href: string;
        icon?: LucideIcon;
    };
}

export function PageHeader({
    title,
    description,
    backUrl,
    backLabel = 'Back',
    editUrl,
    actions,
    action,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                {backUrl && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-2 -ml-2"
                        asChild
                    >
                        <Link href={backUrl}>
                            <ArrowLeft className="mr-1 size-4" />
                            {backLabel}
                        </Link>
                    </Button>
                )}
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {(actions || action || editUrl) && (
                <div className="flex items-center gap-2">
                    {editUrl && (
                        <Button size="sm" asChild>
                            <Link href={editUrl}>Edit</Link>
                        </Button>
                    )}
                    {action && (
                        <Button size="sm" asChild>
                            <Link href={action.href}>
                                {action.icon && (
                                    <action.icon className="mr-1 size-4" />
                                )}
                                {action.label}
                            </Link>
                        </Button>
                    )}
                    {actions}
                </div>
            )}
        </div>
    );
}
