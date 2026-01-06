import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { ProductSizeFormComponent } from '@/modules/product/components';
import { useProductSizeForm } from '@/modules/product/hooks';
import { type ProductType } from '@/modules/product/types';
import { index } from '@/routes/product-sizes';
import { useInertiaProps } from '@/shared/hooks/UseInertiaProps';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Sizes',
        href: '/product-sizes',
    },
    {
        title: 'Create',
        href: '/product-sizes/create',
    },
];

interface ProductSizeCreateProps {
    productTypes: ProductType[];
}

export default function ProductSizesCreate() {
    const { productTypes } = useInertiaProps<ProductSizeCreateProps>();
    const { data, errors, processing, updateField, submit } =
        useProductSizeForm();

    const handleSubmit = () => {
        submit(index().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product Size" />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create Product Size
                        </h1>
                        <p className="text-muted-foreground">
                            Add a new product size to the system
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Product Size Details</CardTitle>
                        <CardDescription>
                            Enter the details for the new product size
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProductSizeFormComponent
                            data={data}
                            errors={errors}
                            processing={processing}
                            productTypes={productTypes}
                            onChange={updateField}
                            onSubmit={handleSubmit}
                            submitLabel="Create Product Size"
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
