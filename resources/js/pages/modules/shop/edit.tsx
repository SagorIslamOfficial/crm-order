import AppLayout from '@/layouts/app-layout';
import { ShopForm } from '@/modules/shop';
import { type Shop } from '@/modules/shop/types';
import { edit, index, show } from '@/routes/shops';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    shop: Shop;
}

const breadcrumbs = (shop: Shop): BreadcrumbItem[] => [
    {
        title: 'Shops',
        href: index().url,
    },
    {
        title: shop.name,
        href: show(shop.id).url,
    },
    {
        title: 'Edit',
        href: edit(shop.id).url,
    },
];

export default function ShopsEdit({ shop }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(shop)}>
            <Head title={`Edit ${shop.name}`} />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Shop
                        </h1>
                        <p className="text-muted-foreground">
                            Update shop information
                        </p>
                    </div>
                </div>

                {/* Shop Form Component */}
                <ShopForm shop={shop} />
            </div>
        </AppLayout>
    );
}
