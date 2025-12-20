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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/shops';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import React from 'react';

interface Shop {
    id: string;
    code: string;
    name: string;
    address: string;
    phone: string;
    website: string | null;
    is_active: boolean;
}

interface Props {
    shop: Shop;
}

const breadcrumbs = (shop: Shop): BreadcrumbItem[] => [
    {
        title: 'Shops',
        href: '/shops',
    },
    {
        title: shop.name,
        href: `/shops/${shop.id}`,
    },
    {
        title: 'Edit',
        href: `/shops/${shop.id}/edit`,
    },
];

export default function ShopsEdit({ shop }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        code: shop.code,
        name: shop.name,
        address: shop.address,
        phone: shop.phone,
        website: shop.website || '',
        is_active: shop.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(shop.id).url, {
            onSuccess: () => {
                window.location.href = index().url;
            },
        });
    };

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

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Shop Details</CardTitle>
                        <CardDescription>
                            Update the shop information below
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Shop Code</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            setData(
                                                'code',
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        placeholder="e.g., DHK, CTG"
                                        maxLength={10}
                                        required
                                    />
                                    {errors.code && (
                                        <p className="text-sm text-red-600">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Shop Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => setData('name', e.target.value)}
                                        placeholder="Enter shop name"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>,
                                    ) => setData('address', e.target.value)}
                                    placeholder="Enter complete shop address"
                                    rows={3}
                                    required
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-600">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => setData('phone', e.target.value)}
                                        placeholder="01711234567"
                                        maxLength={11}
                                        required
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">
                                        Website (Optional)
                                    </Label>
                                    <Input
                                        id="website"
                                        value={data.website}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => setData('website', e.target.value)}
                                        placeholder="www.example.com"
                                    />
                                    {errors.website && (
                                        <p className="text-sm text-red-600">
                                            {errors.website}
                                        </p>
                                    )}
                                </div>
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
                                    <Label
                                        htmlFor="is_active"
                                        className="cursor-pointer"
                                    >
                                        Active
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Shop is currently operational and
                                        accepting orders
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
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Link href={index().url}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                    >
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
