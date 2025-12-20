import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/product-sizes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

interface ProductType {
    id: string;
    name: string;
}

interface ProductSize {
    id: string;
    size_label: string;
    is_active: boolean;
    product_type_id: string;
}

interface Props {
    productSize: ProductSize;
    productTypes: ProductType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Sizes',
        href: '/product-sizes',
    },
    {
        title: 'Edit',
        href: '/product-sizes/edit',
    },
];

export default function ProductSizesEdit({ productSize, productTypes }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        product_type_id: productSize.product_type_id,
        size_label: productSize.size_label,
        is_active: productSize.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(update(productSize.id).url, {
            onSuccess: () => {
                window.location.href = index().url;
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${productSize.size_label}`} />
            <div className="m-auto flex h-full w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Product Size
                        </h1>
                        <p className="text-muted-foreground">
                            Update the details for {productSize.size_label}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Product Size Details</CardTitle>
                        <CardDescription>
                            Update the details for this product size
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="product_type_id">
                                    Product Type
                                </Label>
                                <Select
                                    value={data.product_type_id}
                                    onValueChange={(value) =>
                                        setData('product_type_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a product type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productTypes.map((productType) => (
                                            <SelectItem
                                                key={productType.id}
                                                value={productType.id}
                                            >
                                                {productType.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.product_type_id && (
                                    <p className="text-sm text-red-600">
                                        {errors.product_type_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="size_label">Size Label</Label>
                                <Input
                                    id="size_label"
                                    value={data.size_label}
                                    onChange={(e) =>
                                        setData('size_label', e.target.value)
                                    }
                                    placeholder="Enter size label (e.g., Small, Medium, Large)"
                                    required
                                />
                                {errors.size_label && (
                                    <p className="text-sm text-red-600">
                                        {errors.size_label}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', Boolean(checked))
                                    }
                                />
                                <div className="space-y-1 leading-none">
                                    <Label htmlFor="is_active">Active</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable this product size for use
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Product Size'}
                                </Button>
                                <Link href={index().url}>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
