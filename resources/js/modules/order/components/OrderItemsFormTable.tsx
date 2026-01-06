import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Trash } from 'lucide-react';
import type { OrderItemFormData, ProductType } from '../types';

interface OrderItemsFormTableProps {
    items: OrderItemFormData[];
    productTypes: ProductType[];
    onAddItem: () => void;
    onRemoveItem: (index: number) => void;
    onUpdateItem: (
        index: number,
        field: keyof OrderItemFormData,
        value: string | number,
    ) => void;
    onUpdateMultiple: (
        index: number,
        updates: Partial<OrderItemFormData>,
    ) => void;
    description?: string;
}

export function OrderItemsFormTable({
    items,
    productTypes,
    onAddItem,
    onRemoveItem,
    onUpdateItem,
    onUpdateMultiple,
    description = 'Add products to the order',
}: OrderItemsFormTableProps) {
    const getAvailableSizes = (productTypeId: string) => {
        const productType = productTypes.find((pt) => pt.id === productTypeId);
        return productType?.sizes || [];
    };

    const handleProductTypeChange = (index: number, value: string) => {
        onUpdateMultiple(index, {
            product_type_id: value,
            product_size_id: '',
        });
    };

    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Order Items</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onAddItem}
                    >
                        <Plus className="mr-2 size-4" />
                        Add Item
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="grid gap-4 rounded-lg border p-4 md:grid-cols-12"
                        >
                            {/* Product Type */}
                            <div className="space-y-2 md:col-span-3">
                                <Label>Product Type</Label>
                                <Select
                                    name={`items[${index}][product_type_id]`}
                                    value={item.product_type_id}
                                    onValueChange={(value) =>
                                        handleProductTypeChange(index, value)
                                    }
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productTypes.map((type) => (
                                            <SelectItem
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Product Size */}
                            <div className="space-y-2 md:col-span-2">
                                <Label>Size</Label>
                                <Select
                                    name={`items[${index}][product_size_id]`}
                                    value={item.product_size_id}
                                    onValueChange={(value) =>
                                        onUpdateItem(
                                            index,
                                            'product_size_id',
                                            value,
                                        )
                                    }
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent
                                        key={`size-select-${index}-${item.product_type_id}`}
                                    >
                                        {getAvailableSizes(
                                            item.product_type_id,
                                        ).map((size) => (
                                            <SelectItem
                                                key={size.id}
                                                value={size.id}
                                            >
                                                {size.size_label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2 md:col-span-2">
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    name={`items[${index}][quantity]`}
                                    value={item.quantity}
                                    onChange={(e) =>
                                        onUpdateItem(
                                            index,
                                            'quantity',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    min={1}
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div className="space-y-2 md:col-span-2">
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    name={`items[${index}][price]`}
                                    value={item.price}
                                    onChange={(e) =>
                                        onUpdateItem(
                                            index,
                                            'price',
                                            parseFloat(e.target.value) || 0,
                                        )
                                    }
                                    min={0}
                                    step="0.01"
                                    required
                                />
                            </div>

                            {/* Subtotal */}
                            <div className="space-y-2 md:col-span-2">
                                <Label>Subtotal</Label>
                                <Input
                                    value={`৳${(item.quantity * item.price).toFixed(2)}`}
                                    disabled
                                />
                            </div>

                            {/* Remove Button */}
                            <div className="flex items-center pt-4 md:col-span-1">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => onRemoveItem(index)}
                                    disabled={items.length === 1}
                                    title={
                                        items.length === 1
                                            ? 'At least one item required'
                                            : 'Remove item'
                                    }
                                >
                                    <Trash className="size-4" />
                                </Button>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2 md:col-span-12">
                                <Label>Notes</Label>
                                <Input
                                    name={`items[${index}][notes]`}
                                    placeholder="Add any notes for this item"
                                    value={item.notes || ''}
                                    onChange={(e) =>
                                        onUpdateItem(
                                            index,
                                            'notes',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
