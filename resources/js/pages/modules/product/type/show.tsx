import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { edit, index } from '@/routes/product-types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

interface ProductSize {
    id: string;
    size_label: string;
    is_active: boolean;
}

interface ProductType {
    id: string;
    name: string;
    is_active: boolean;
    sizes: ProductSize[];
    sizes_count: number;
    orders_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    productType: ProductType;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Types',
        href: '/product-types',
    },
    {
        title: 'Details',
        href: '/product-types/show',
    },
];

export default function ProductTypesShow({ productType }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={productType.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Product Types
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {productType.name}
                            </h1>
                            <p className="text-muted-foreground">
                                Product type details and associated sizes
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit(productType.id).url}>
                            <Button variant="outline" className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge
                                variant={
                                    productType.is_active
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {productType.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sizes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {productType.sizes_count}
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
                                {productType.orders_count}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sizes Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Associated Sizes</CardTitle>
                        <CardDescription>
                            Sizes available for this product type
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {productType.sizes.length === 0 ? (
                            <p className="text-muted-foreground">
                                No sizes associated with this product type.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Size Label</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productType.sizes.map((size) => (
                                        <TableRow key={size.id}>
                                            <TableCell className="font-medium">
                                                {size.size_label}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        size.is_active
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {size.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
