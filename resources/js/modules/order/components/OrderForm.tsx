import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import type { OrderForm, OrderItemForm } from '../types';

interface OrderFormComponentProps {
    data: OrderForm;
    errors: Record<string, string>;
    processing: boolean;
    shops: Array<{ id: string; name: string; code: string }>;
    customers: Array<{ id: string; name: string; phone: string }>;
    productTypes: Array<{ id: string; name: string }>;
    productSizes: Array<{ id: string; name: string }>;
    onChange: <K extends keyof OrderForm>(
        field: K,
        value: OrderForm[K],
    ) => void;
    onAddItem: () => void;
    onUpdateItem: (
        index: number,
        field: keyof OrderItemForm,
        value: string | number,
    ) => void;
    onRemoveItem: (index: number) => void;
    onSubmit: () => void;
    submitLabel?: string;
    totalAmount?: number;
}

export function OrderFormComponent({
    data,
    errors,
    processing,
    shops,
    customers,
    productTypes,
    productSizes,
    onChange,
    onAddItem,
    onUpdateItem,
    onRemoveItem,
    onSubmit,
    submitLabel = 'Create Order',
    totalAmount = 0,
}: OrderFormComponentProps) {
    return (
        <div className="space-y-6">
            {/* Order Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="shop_id">Shop *</Label>
                            <Select
                                value={data.shop_id}
                                onValueChange={(value) =>
                                    onChange('shop_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a shop" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shops.map((shop) => (
                                        <SelectItem
                                            key={shop.id}
                                            value={shop.id}
                                        >
                                            {shop.name} ({shop.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.shop_id} />
                        </div>

                        <div>
                            <Label htmlFor="customer_id">Customer *</Label>
                            <Select
                                value={data.customer_id}
                                onValueChange={(value) =>
                                    onChange('customer_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((customer) => (
                                        <SelectItem
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.name} ({customer.phone})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.customer_id} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="delivery_date">
                                Delivery Date *
                            </Label>
                            <Input
                                id="delivery_date"
                                type="date"
                                value={data.delivery_date}
                                onChange={(e) =>
                                    onChange('delivery_date', e.target.value)
                                }
                            />
                            <InputError message={errors.delivery_date} />
                        </div>

                        <div>
                            <Label htmlFor="discount_type">Discount Type</Label>
                            <Select
                                value={data.discount_type}
                                onValueChange={(
                                    value: 'percentage' | 'fixed',
                                ) => onChange('discount_type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed">
                                        Fixed Amount
                                    </SelectItem>
                                    <SelectItem value="percentage">
                                        Percentage
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="delivery_address">
                            Delivery Address
                        </Label>
                        <Textarea
                            id="delivery_address"
                            value={data.delivery_address}
                            onChange={(e) =>
                                onChange('delivery_address', e.target.value)
                            }
                            placeholder="Enter delivery address..."
                            rows={3}
                        />
                        <InputError message={errors.delivery_address} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="discount_amount">
                                Discount Amount
                            </Label>
                            <Input
                                id="discount_amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.discount_amount}
                                onChange={(e) =>
                                    onChange('discount_amount', e.target.value)
                                }
                                placeholder="0.00"
                            />
                            <InputError message={errors.discount_amount} />
                        </div>

                        <div className="flex items-end">
                            <div className="w-full">
                                <Label>Total Amount</Label>
                                <div className="text-2xl font-bold">
                                    ${totalAmount.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Order Items</CardTitle>
                        <Button type="button" onClick={onAddItem} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {data.items.length === 0 ? (
                        <p className="py-4 text-center text-muted-foreground">
                            No items added yet. Click "Add Item" to get started.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {data.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <h4 className="font-medium">
                                            Item {index + 1}
                                        </h4>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onRemoveItem(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        <div>
                                            <Label>Product Type *</Label>
                                            <Select
                                                value={item.product_type_id}
                                                onValueChange={(value) =>
                                                    onUpdateItem(
                                                        index,
                                                        'product_type_id',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {productTypes.map(
                                                        (type) => (
                                                            <SelectItem
                                                                key={type.id}
                                                                value={type.id}
                                                            >
                                                                {type.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Product Size *</Label>
                                            <Select
                                                value={item.product_size_id}
                                                onValueChange={(value) =>
                                                    onUpdateItem(
                                                        index,
                                                        'product_size_id',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {productSizes.map(
                                                        (size) => (
                                                            <SelectItem
                                                                key={size.id}
                                                                value={size.id}
                                                            >
                                                                {size.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Quantity *</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    onUpdateItem(
                                                        index,
                                                        'quantity',
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Price *</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.price}
                                                onChange={(e) =>
                                                    onUpdateItem(
                                                        index,
                                                        'price',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Label>Notes</Label>
                                        <Textarea
                                            value={item.notes || ''}
                                            onChange={(e) =>
                                                onUpdateItem(
                                                    index,
                                                    'notes',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Optional notes..."
                                            rows={2}
                                        />
                                    </div>

                                    <div className="mt-2 text-right">
                                        <Badge variant="outline">
                                            Line Total: $
                                            {(
                                                parseFloat(item.price) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button onClick={onSubmit} disabled={processing}>
                    {processing ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </div>
    );
}
