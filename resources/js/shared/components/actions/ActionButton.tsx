import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PermissionGuard } from '@/shared/components/common/PermissionGuard';
import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
    label?: string;
    icon?: LucideIcon;

    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link';

    size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
    href?: string;
    onClick?: () => void;
    permission?: string | string[];
    disabled?: boolean;
    className?: string;
    title?: string;
}

export function ActionButton({
    label,
    icon: Icon,
    variant = 'ghost',
    size = 'sm',
    href,
    onClick,
    permission,
    disabled,
    className,
    title,
}: ActionButtonProps) {
    const buttonContent = (
        <Button
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={disabled}
            className={cn(label && Icon && 'gap-1', className)}
            title={title}
        >
            {Icon && <Icon className="h-4 w-4" />}
            {label}
        </Button>
    );

    const content = href ? (
        <Link href={href}>{buttonContent}</Link>
    ) : (
        buttonContent
    );

    if (permission) {
        return (
            <PermissionGuard permission={permission}>{content}</PermissionGuard>
        );
    }

    return content;
}
