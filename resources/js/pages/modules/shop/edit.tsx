import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { ShopEditForm } from '@/components/modules/shop';
import type { Shop } from '@/components/modules/shop/types/Shop.types';
import { index as shopsIndex } from '@/routes/shops';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { ArrowLeft } from 'lucide-react';

interface Props extends PageProps {
    shop: Shop;
}

export default function ShopsEdit({ shop }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Shops',
            href: shopsIndex().url,
        },
        {
            title: shop.name,
            href: '#',
        },
        {
            title: 'Edit',
            href: '#',
        },
    ];

    return (
        <MainPageLayout
            title={`Edit ${shop.name}`}
            description="Update shop information"
            breadcrumbs={breadcrumbs}
            backButton={{
                label: 'Back',
                href: shopsIndex().url,
                icon: ArrowLeft,
            }}
            useCard={false}
        >
            <div className="mx-auto max-w-2xl">
                <ShopEditForm shop={shop} />
            </div>
        </MainPageLayout>
    );
}
