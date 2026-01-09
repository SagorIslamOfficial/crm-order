import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { ShopShow } from '@/components/modules/shop';
import type { Shop } from '@/components/modules/shop/types/Shop.types';
import { dashboard } from '@/routes';
import {
    edit as shopsEdit,
    index as shopsIndex,
    show as shopsShow,
} from '@/routes/shops';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit } from 'lucide-react';

interface Props {
    shop: Shop;
}

export default function ShopsShow({ shop }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Shops',
            href: shopsIndex().url,
        },
        {
            title: shop.name,
            href: shopsShow(shop.id).url,
        },
    ];

    return (
        <MainPageLayout
            title={shop.name}
            description={`${shop.code} - Shop details and statistics`}
            breadcrumbs={breadcrumbs}
            backButton={{
                href: shopsIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            editButton={{
                href: shopsEdit(shop.id).url,
                icon: Edit,
                label: 'Edit',
            }}
            useCard={false}
        >
            <ShopShow shop={shop} />
        </MainPageLayout>
    );
}
