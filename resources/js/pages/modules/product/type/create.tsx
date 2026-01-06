import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { ProductTypeFormComponent } from '@/modules/product/components';
import { useProductTypeForm } from '@/modules/product/hooks';
import { index } from '@/routes/product-types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Types',
        href: '/product-types',
    },
    {
        title: 'Create',
        href: '/product-types/create',
    },
];

export default function ProductTypesCreate() {
    const { data, errors, processing, updateField, submit } =
        useProductTypeForm();

    const handleSubmit = () => {
        submit(index().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product Type" />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create Product Type
                        </h1>
                        <p className="text-muted-foreground">
                            Add a new product type to the system
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Product Type Details</CardTitle>
                        <CardDescription>
                            Enter the details for the new product type
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProductTypeFormComponent
                            data={data}
                            errors={errors}
                            processing={processing}
                            onChange={updateField}
                            onSubmit={handleSubmit}
                            submitLabel="Create Product Type"
                        />

                        <div className="mt-6 flex gap-4">
                            <Link href={index().url}>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
