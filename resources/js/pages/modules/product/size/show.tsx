import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { edit, index } from '@/routes/product-sizes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

interface ProductType {
    id: string;
    name: string;
}

interface ProductSize {
    id: string;
    size_label: string;
    is_active: boolean;
    product_type: ProductType;
    created_at: string;
    orders_count: number;
}

interface Props {
    productSize: ProductSize;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Sizes',
        href: '/product-sizes',
    },
    {
        title: 'Details',
        href: '/product-sizes/show',
    },
];

export default function ProductSizesShow({ productSize }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={productSize.size_label} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Product Sizes
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {productSize.size_label}
                            </h1>
                            <p className="text-muted-foreground">
                                Product size details and statistics
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit(productSize.id).url}>
                            <Button variant="outline" className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge
                                variant={
                                    productSize.is_active
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {productSize.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Product Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {productSize.product_type.name}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {productSize.orders_count}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Size Information</CardTitle>
                        <CardDescription>
                            Detailed information about this product size
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Size Label
                                </Label>
                                <p className="text-lg font-semibold">
                                    {productSize.size_label}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Product Type
                                </Label>
                                <p className="text-lg font-semibold">
                                    {productSize.product_type.name}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Status
                                </Label>
                                <div className="mt-1">
                                    <Badge
                                        variant={
                                            productSize.is_active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {productSize.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
