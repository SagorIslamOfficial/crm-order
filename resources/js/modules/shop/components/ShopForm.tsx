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
import { index } from '@/routes/shops';
import { Link, router } from '@inertiajs/react';
import { useShopForm } from '../hooks';
import type { Shop } from '../types';

interface ShopFormProps {
    shop?: Shop;
    onSuccess?: () => void;
}

export function ShopForm({ shop, onSuccess }: ShopFormProps) {
    const form = useShopForm({
        shop,
        onSuccess: () => {
            router.visit('/shops');
            onSuccess?.();
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (shop) {
            await form.submit('put', `/shops/${shop.id}`);
        } else {
            await form.submit('post', '/shops');
        }
    };

    return (
        <Card className="mx-auto max-w-2xl">
            <CardHeader>
                <CardTitle>{shop ? 'Edit Shop' : 'Create Shop'}</CardTitle>
                <CardDescription>
                    {shop
                        ? 'Update the shop information below.'
                        : 'Fill in the details to create a new shop.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="code">Code *</Label>
                            <Input
                                id="code"
                                name="code"
                                value={form.data.code}
                                onChange={(e) =>
                                    form.setData('code', e.target.value)
                                }
                                placeholder="SHOP001"
                                required
                            />
                            {form.errors.code && (
                                <p className="text-sm text-red-600">
                                    {form.errors.code}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                placeholder="Shop Name"
                                required
                            />
                            {form.errors.name && (
                                <p className="text-sm text-red-600">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                name="address"
                                value={form.data.address || ''}
                                onChange={(e) =>
                                    form.setData('address', e.target.value)
                                }
                                placeholder="Shop address"
                                rows={3}
                            />
                            {form.errors.address && (
                                <p className="text-sm text-red-600">
                                    {form.errors.address}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={form.data.phone || ''}
                                onChange={(e) =>
                                    form.setData('phone', e.target.value)
                                }
                                placeholder="+1 (555) 123-4567"
                            />
                            {form.errors.phone && (
                                <p className="text-sm text-red-600">
                                    {form.errors.phone}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                name="website"
                                value={form.data.website || ''}
                                onChange={(e) =>
                                    form.setData('website', e.target.value)
                                }
                                placeholder="https://example.com"
                            />
                            {form.errors.website && (
                                <p className="text-sm text-red-600">
                                    {form.errors.website}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={form.data.location || ''}
                                onChange={(e) =>
                                    form.setData('location', e.target.value)
                                }
                                placeholder="City, State"
                            />
                            {form.errors.location && (
                                <p className="text-sm text-red-600">
                                    {form.errors.location}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="next_order_sequence">
                                Next Order Sequence
                            </Label>
                            <Input
                                id="next_order_sequence"
                                name="next_order_sequence"
                                type="number"
                                value={form.data.next_order_sequence}
                                onChange={(e) =>
                                    form.setData(
                                        'next_order_sequence',
                                        parseInt(e.target.value) || 1,
                                    )
                                }
                                min="1"
                            />
                            {form.errors.next_order_sequence && (
                                <p className="text-sm text-red-600">
                                    {form.errors.next_order_sequence}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="details">Details</Label>
                            <Textarea
                                id="details"
                                name="details"
                                value={form.data.details || ''}
                                onChange={(e) =>
                                    form.setData('details', e.target.value)
                                }
                                placeholder="Additional details about the shop"
                                rows={3}
                            />
                            {form.errors.details && (
                                <p className="text-sm text-red-600">
                                    {form.errors.details}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                checked={form.data.is_active}
                                onCheckedChange={(checked) =>
                                    form.setData('is_active', !!checked)
                                }
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                    </div>

                    {Object.keys(form.errors).length > 0 && !form.hasErrors && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-600">
                                Please check the form for errors.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <Link href={index().url}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing
                                ? 'Saving...'
                                : shop
                                  ? 'Update Shop'
                                  : 'Create Shop'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
