import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ShopList } from '@/modules/shop';
import { type Shop } from '@/modules/shop/types';
import { destroy, index } from '@/routes/shops';
import {
    ConfirmDialog,
    MainPageLayout,
    useDeleteDialog,
} from '@/shared/components';
import { useInertiaProps } from '@/shared/hooks/UseInertiaProps';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface ShopIndexProps extends PageProps {
    shops: {
        data: Shop[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    search?: string;
    isActive?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shops',
        href: '/shops',
    },
];

export default function ShopIndex() {
    const { shops, search, isActive } = useInertiaProps<ShopIndexProps>();
    const [statusFilter, setStatusFilter] = useState<string>(isActive || 'all');

    const deleteDialog = useDeleteDialog<Shop>({
        getItemName: (shop) => shop.name,
        onDelete: (shop) => {
            router.delete(destroy(shop.id));
        },
    });

    const handleSearch = (searchQuery: string) => {
        router.get(index(), {
            search: searchQuery || undefined,
            is_active: statusFilter !== 'all' ? statusFilter : undefined,
        });
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        router.get(index(), {
            search: search || undefined,
            is_active: value !== 'all' ? value : undefined,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(index(), {
            search: search || undefined,
            is_active: statusFilter !== 'all' ? statusFilter : undefined,
            page,
        });
    };

    const hasActiveFilters = search || (statusFilter && statusFilter !== 'all');

    return (
        <MainPageLayout
            title="Shops"
            description="Manage shop locations and information"
            breadcrumbs={breadcrumbs}
            createButton={{
                label: 'Add Shop',
                href: '/shops/create',
                icon: Plus,
                permission: 'shops.create',
            }}
            search={{
                placeholder: 'Search shops by name, code, address or phone...',
                defaultValue: search,
                onSearch: handleSearch,
                icon: Search,
            }}
            showClearFilters={hasActiveFilters}
            onClearFilters={() => {
                setStatusFilter('all');
                router.get(index());
            }}
            filters={
                <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilterChange}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            }
            useCard={false}
        >
            <ShopList
                shops={shops.data}
                pagination={shops}
                onDelete={deleteDialog.show}
                onPageChange={handlePageChange}
            />

            <ConfirmDialog
                {...deleteDialog.dialogProps}
                title="Delete Shop"
                description={`Are you sure you want to delete "${deleteDialog.itemName}"? This action cannot be undone.`}
            />
        </MainPageLayout>
    );
}
