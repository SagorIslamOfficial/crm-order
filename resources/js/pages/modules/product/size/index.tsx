import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ProductSizeList } from '@/modules/product/components';
import { type ProductSize, type ProductType } from '@/modules/product/types';
import { destroy, index } from '@/routes/product-sizes';
import {
    ConfirmDialog,
    MainPageLayout,
    useDeleteDialog,
} from '@/shared/components';
import { useInertiaProps } from '@/shared/hooks/UseInertiaProps';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface ProductSizeIndexProps {
    productSizes: {
        data: ProductSize[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    productTypes: ProductType[];
    search?: string;
    productTypeId?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Sizes',
        href: '/product-sizes',
    },
];

export default function ProductSizesIndex() {
    const { productSizes, productTypes, search, productTypeId } =
        useInertiaProps<ProductSizeIndexProps>();
    const [typeFilter, setTypeFilter] = useState(productTypeId || 'all');

    const deleteDialog = useDeleteDialog<ProductSize>({
        getItemName: (productSize) => productSize.size_label,
        onDelete: (productSize) => {
            router.delete(destroy(productSize.id));
        },
    });

    const handleSearch = (searchQuery: string) => {
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (typeFilter && typeFilter !== 'all')
            params.product_type_id = typeFilter;

        router.get(index(), params);
    };

    const handleTypeFilterChange = (value: string) => {
        setTypeFilter(value);
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (value && value !== 'all') params.product_type_id = value;

        router.get(index(), params);
    };

    const hasActiveFilters = search || (typeFilter && typeFilter !== 'all');

    return (
        <MainPageLayout
            title="Product Sizes"
            description="Manage product sizes for different product types"
            breadcrumbs={breadcrumbs}
            createButton={{
                label: 'Add Product Size',
                href: '/product-sizes/create',
                icon: Plus,
                permission: 'product-sizes.create',
            }}
            search={{
                placeholder: 'Search product sizes...',
                defaultValue: search,
                onSearch: handleSearch,
                icon: Search,
            }}
            showClearFilters={hasActiveFilters}
            onClearFilters={() => {
                setTypeFilter('all');
                router.get(index());
            }}
            filters={
                <Select
                    value={typeFilter}
                    onValueChange={handleTypeFilterChange}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by product type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Product Types</SelectItem>
                        {productTypes.map((productType) => (
                            <SelectItem
                                key={productType.id}
                                value={productType.id.toString()}
                            >
                                {productType.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            }
            useCard={false}
        >
            <ProductSizeList
                productSizes={productSizes.data}
                onDelete={deleteDialog.show}
            />

            <ConfirmDialog
                {...deleteDialog.dialogProps}
                title="Delete Product Size"
                description={`Are you sure you want to delete "${deleteDialog.itemName}"? This action cannot be undone.`}
            />
        </MainPageLayout>
    );
}
