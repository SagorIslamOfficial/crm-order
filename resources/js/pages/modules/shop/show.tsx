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
import { edit, index, show } from '@/routes/shops';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Building, Edit, Globe, MapPin, Phone } from 'lucide-react';

interface Shop {
    id: string;
    code: string;
    name: string;
    address: string;
    phone: string;
    website: string | null;
    is_active: boolean;
    next_order_sequence: number;
    created_at: string;
    orders_count: number;
}

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
];

export default function ShopsShow({ shop }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(shop)}>
            <Head title={shop.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {shop.name}
                                </h1>
                                <Badge variant="outline" className="text-sm">
                                    {shop.code}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Shop details and statistics
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={edit(shop.id).url}>
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
                                    shop.is_active ? 'default' : 'secondary'
                                }
                            >
                                {shop.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {shop.orders_count}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Orders processed
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Next Order Number
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {shop.code}-
                                {String(shop.next_order_sequence).padStart(
                                    6,
                                    '0',
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Sequential numbering
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Registered
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Date(shop.created_at).toLocaleDateString(
                                    'en-US',
                                    {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    },
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Shop created
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Shop Details */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shop Information</CardTitle>
                            <CardDescription>
                                Basic shop details and identification
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building className="h-4 w-4" />
                                    Shop Code
                                </Label>
                                <p className="text-lg font-medium">
                                    {shop.code}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building className="h-4 w-4" />
                                    Shop Name
                                </Label>
                                <p className="text-lg font-medium">
                                    {shop.name}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    Address
                                </Label>
                                <p className="text-base">{shop.address}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>
                                How to reach this shop location
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    Phone Number
                                </Label>
                                <p className="text-lg font-medium">
                                    {shop.phone}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Globe className="h-4 w-4" />
                                    Website
                                </Label>
                                {shop.website ? (
                                    <a
                                        href={`https://${shop.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-medium text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        {shop.website}
                                    </a>
                                ) : (
                                    <p className="text-base text-muted-foreground">
                                        No website provided
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Management Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Management</CardTitle>
                        <CardDescription>
                            Order numbering and processing information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">
                                    Shop Code
                                </Label>
                                <p className="text-xl font-bold">{shop.code}</p>
                                <p className="text-sm text-muted-foreground">
                                    Used in order numbers
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">
                                    Next Order Sequence
                                </Label>
                                <p className="text-xl font-bold">
                                    {String(shop.next_order_sequence).padStart(
                                        6,
                                        '0',
                                    )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Auto-increments on new orders
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">
                                    Next Order Number Format
                                </Label>
                                <p className="font-mono text-xl font-bold">
                                    ORD-{shop.code}-
                                    {String(shop.next_order_sequence).padStart(
                                        6,
                                        '0',
                                    )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Unique identifier format
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
