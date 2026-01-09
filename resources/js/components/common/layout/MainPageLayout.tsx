import { PermissionGuard } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React, { useState } from 'react';

interface MainPageLayoutProps {
    title?: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];

    createButton?: {
        label: string;
        href: string;
        icon?: React.ComponentType<{ className?: string }>;
        permission?: string | string[];
    };

    backButton?: {
        label?: string;
        href: string;
        icon?: React.ComponentType<{ className?: string }>;
    };

    editButton?: {
        label?: string;
        href: string;
        icon?: React.ComponentType<{ className?: string }>;
        permission?: string | string[];
    };

    search?: {
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        onSearch: (value: string) => void;
    };

    columnsButton?: React.ReactNode;

    useCard?: boolean;
    cardTitle?: string;
    cardDescription?: string;
    children: React.ReactNode;
    className?: string;
    wrapperClassName?: string;
}

export function MainPageLayout({
    title,
    description,
    breadcrumbs,
    createButton,
    backButton,
    editButton,
    search,
    columnsButton,
    useCard = true,
    cardTitle,
    cardDescription,
    children,
    className,
    wrapperClassName,
}: MainPageLayoutProps) {
    const [searchValue, setSearchValue] = useState(
        search?.defaultValue || search?.value || '',
    );

    React.useEffect(() => {
        if (search?.value !== undefined) {
            setSearchValue(search.value);
        } else if (search?.defaultValue !== undefined) {
            setSearchValue(search.defaultValue);
        }
    }, [search?.value, search?.defaultValue]);

    const handleSearchSubmit = () => {
        if (search?.onSearch) {
            search.onSearch(searchValue);
        }
    };

    const content = (
        <>
            <Head title={title} />

            <div
                className={cn(
                    'flex h-full flex-1 flex-col gap-6 p-4 md:p-6',
                    wrapperClassName,
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-sm text-muted-foreground md:text-base">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {backButton && (
                            <Link href={backButton.href}>
                                <Button variant="secondary" size="sm">
                                    {backButton.icon && (
                                        <backButton.icon className="h-4 w-4" />
                                    )}
                                    {backButton.label || 'Back'}
                                </Button>
                            </Link>
                        )}
                        {editButton && (
                            <PermissionGuard permission={editButton.permission}>
                                <Link href={editButton.href}>
                                    <Button size="sm" variant="default">
                                        {editButton.icon && (
                                            <editButton.icon className="mr-2 h-4 w-4" />
                                        )}
                                        {editButton.label || 'Edit'}
                                    </Button>
                                </Link>
                            </PermissionGuard>
                        )}
                        {createButton && (
                            <PermissionGuard
                                permission={createButton.permission}
                            >
                                <Link href={createButton.href}>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        {createButton.icon && (
                                            <createButton.icon className="h-4 w-4" />
                                        )}
                                        {createButton.label}
                                    </Button>
                                </Link>
                            </PermissionGuard>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    {/* Search */}
                    {search && (
                        <div className="bg-background p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium whitespace-nowrap">
                                        Search
                                    </Label>
                                    <div className="w-96">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSearchSubmit();
                                            }}
                                            className="relative"
                                        >
                                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder={
                                                    search.placeholder ||
                                                    'Search...'
                                                }
                                                value={searchValue}
                                                onChange={(e) => {
                                                    setSearchValue(
                                                        e.target.value,
                                                    );
                                                    search.onSearch(
                                                        e.target.value,
                                                    );
                                                }}
                                                className="pl-9"
                                            />
                                        </form>
                                    </div>{' '}
                                </div>
                                <div className="ml-auto">{columnsButton}</div>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    {useCard ? (
                        <div>
                            {(cardTitle || cardDescription) && (
                                <div className="border-b bg-background px-6 py-4">
                                    {cardTitle && (
                                        <h2 className="text-lg font-semibold">
                                            {cardTitle}
                                        </h2>
                                    )}
                                    {cardDescription && (
                                        <p className="text-sm text-muted-foreground">
                                            {cardDescription}
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className={cn('bg-background p-4', className)}>
                                {children}
                            </div>
                        </div>
                    ) : (
                        <div className={cn('bg-background p-4', className)}>
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    if (breadcrumbs) {
        return <AppLayout breadcrumbs={breadcrumbs}>{content}</AppLayout>;
    }

    return <AppLayout>{content}</AppLayout>;
}

interface DeleteDialogState<T> {
    open: boolean;
    item: T | null;
    deleting: boolean;
}

interface UseDeleteDialogOptions<T> {
    getItemName: (item: T) => string;
    onDelete: (item: T) => void | Promise<void>;
    onSuccess?: () => void;
}

export function useDeleteDialog<T>({
    getItemName,
    onDelete,
    onSuccess,
}: UseDeleteDialogOptions<T>) {
    const [state, setState] = useState<DeleteDialogState<T>>({
        open: false,
        item: null,
        deleting: false,
    });

    const show = (item: T) => {
        setState({ open: true, item, deleting: false });
    };

    const hide = () => {
        setState({ open: false, item: null, deleting: false });
    };

    const confirm = async () => {
        if (!state.item) return;

        setState((prev) => ({ ...prev, deleting: true }));

        try {
            await onDelete(state.item);
            onSuccess?.();
            hide();
        } catch {
            setState((prev) => ({ ...prev, deleting: false }));
        }
    };

    const itemName = state.item ? getItemName(state.item) : '';

    return {
        show,
        hide,
        confirm,
        item: state.item,
        itemName,
        dialogProps: {
            open: state.open,
            onOpenChange: (open: boolean) => !open && hide(),
            onConfirm: confirm,
            loading: state.deleting,
        },
    };
}

export type { MainPageLayoutProps };
