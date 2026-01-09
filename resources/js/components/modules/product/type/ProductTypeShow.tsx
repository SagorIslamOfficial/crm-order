import { TabsNavigation } from '@/components/common';
import type {
    PaginatedData,
    ProductSize,
    ProductType,
} from '@/components/modules/product/type/types/Product.types';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import { OverviewView, SizesView } from './view';

interface ProductTypeShowProps {
    productType: ProductType;
    sizes: PaginatedData<ProductSize>;
    className?: string;
}

export function ProductTypeShow({
    productType,
    sizes,
    className,
}: ProductTypeShowProps) {
    const searchParams = new URLSearchParams(window.location.search);
    const initialTab =
        searchParams.get('tab') ||
        (searchParams.has('page') ? 'sizes' : 'overview');
    const [activeTab, setActiveTab] = useState(initialTab);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', value);
        if (value !== 'sizes') {
            url.searchParams.delete('page');
        }
        window.history.pushState({}, '', url.toString());
    };

    const tabs = [
        { value: 'overview', label: 'Overview' },
        { value: 'sizes', label: `Sizes (${productType.sizes_count || 0})` },
    ];

    return (
        <div className={className}>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsNavigation tabs={tabs} />

                <TabsContent value="overview" className="grid grid-cols-3">
                    <OverviewView productType={productType} />
                </TabsContent>

                <TabsContent value="sizes">
                    <SizesView sizes={sizes} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
