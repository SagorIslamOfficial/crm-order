import AppLayout from '@/layouts/app-layout';
import { ShopForm } from '@/modules/shop';
import { index, create } from '@/routes/shops';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Shops',
        href: index().url,
    },
    {
        title: 'Create',
        href: create().url,
    },
];

export default function ShopsCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Shop" />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create Shop
                        </h1>
                        <p className="text-muted-foreground">
                            Add a new shop location to the system
                        </p>
                    </div>
                </div>

                {/* Shop Form Component */}
                <ShopForm />
            </div>
        </AppLayout>
    );
}
