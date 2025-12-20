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
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface Shop {
    id: string;
    name: string;
    code: string;
}

interface ProductType {
    id: string;
    name: string;
    sizes: ProductSize[];
}

interface ProductSize {
    id: string;
    size_label: string;
    product_type_id: string;
}

interface OrderItem {
    product_type_id: string;
    product_size_id: string;
    quantity: number;
    price: number;
    notes?: string;
}

interface Order {
    id: string;
    order_number: string;
    shop_id: string;
    customer: {
        phone: string;
        name: string;
        address: string | null;
    };
    items: Array<{
        product_type_id: string;
        product_size_id: string;
        quantity: number;
        price: string;
        notes: string | null;
    }>;
    delivery_date: string;
    delivery_address: string | null;
    discount_type: string;
    discount_amount: string;
    advance_paid: string;
}

interface EditOrderPageProps extends PageProps {
    order: Order;
    shops: Shop[];
    productTypes: ProductType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Orders',
        href: '/orders',
    },
];

export default function EditOrder({
    order,
    shops,
    productTypes,
}: EditOrderPageProps) {
    const [shopId, setShopId] = useState(order.shop_id);

    // Format delivery date to YYYY-MM-DD for date input
    const [deliveryDate, setDeliveryDate] = useState(() => {
        if (!order.delivery_date) return '';
        // Handle both string formats: "2025-12-25" or "2025-12-25 00:00:00"
        return order.delivery_date.split(' ')[0];
    });

    const [items, setItems] = useState<OrderItem[]>(
        order.items.map((item) => ({
            product_type_id: item.product_type_id,
            product_size_id: item.product_size_id,
            quantity: item.quantity,
            price: parseFloat(item.price),
            notes: item.notes || '',
        })),
    );
    const [phone, setPhone] = useState(order.customer.phone);
    const [customerName, setCustomerName] = useState(order.customer.name);
    const [customerAddress, setCustomerAddress] = useState(
        order.customer.address || '',
    );

    // For discount type
    const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>(
        (order.discount_type as 'fixed' | 'percentage') || 'fixed',
    );

    // For discount amount: if percentage, reverse-calculate the original percentage input
    const [discountAmount, setDiscountAmount] = useState<string | number>(
        () => {
            const storedAmount = parseFloat(
                order.discount_amount?.toString() || '0',
            );

            // If discount type is percentage, we need to reverse-calculate the original percentage
            if (order.discount_type === 'percentage') {
                // Calculate the subtotal from items
                const subtotal = order.items.reduce(
                    (
                        sum: number,
                        item: {
                            quantity: number;
                            price: string;
                        },
                    ) => {
                        return sum + item.quantity * parseFloat(item.price);
                    },
                    0,
                );

                // Reverse-calculate: (discount_amount / subtotal) * 100
                if (subtotal > 0) {
                    const percentage = (storedAmount / subtotal) * 100;
                    // Round to 2 decimal places but return as number
                    return Math.round(percentage * 100) / 100;
                }
            }

            // For fixed discount, use the stored amount as is
            return storedAmount;
        },
    );

    const [, setIsSearching] = useState(false);

    const searchCustomer = async (phoneNumber?: string) => {
        const numberToSearch = phoneNumber || phone;

        if (!numberToSearch || numberToSearch.length !== 11) {
            return;
        }

        setIsSearching(true);

        try {
            const response = await fetch(
                `/api/customers/lookup?phone=${numberToSearch}`,
            );
            const data = await response.json();

            if (data.found) {
                setCustomerName(data.customer.name);
                setCustomerAddress(data.customer.address || '');
            }
        } catch (error) {
            console.error('Error searching customer:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handlePhoneChange = (value: string) => {
        setPhone(value);
        // Clear customer data when phone changes
        setCustomerName('');
        setCustomerAddress('');
        // Auto-search when phone number reaches 11 digits
        if (value.length === 11) {
            searchCustomer(value);
        }
    };

    const breadcrumbsWithOrder: BreadcrumbItem[] = [
        ...breadcrumbs,
        {
            title: order.order_number,
            href: `/orders/${order.id}`,
        },
        {
            title: 'Edit',
            href: `/orders/${order.id}/edit`,
        },
    ];

    const addItem = () => {
        setItems([
            ...items,
            {
                product_type_id: '',
                product_size_id: '',
                quantity: 1,
                price: 0,
            },
        ]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (
        index: number,
        field: keyof OrderItem,
        value: string | number,
    ) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const getAvailableSizes = (productTypeId: string) => {
        const productType = productTypes.find((pt) => pt.id === productTypeId);
        return productType?.sizes || [];
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    };

    const calculateDiscount = () => {
        const subtotal = calculateSubtotal();
        const amount =
            typeof discountAmount === 'string'
                ? parseFloat(discountAmount)
                : discountAmount;
        if (discountType === 'percentage') {
            return (subtotal * amount) / 100;
        }
        return amount;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbsWithOrder}>
            <Head title={`Edit Order ${order.order_number}`} />
            <div className="flex flex-col gap-4 p-4">
                <Form action={`/orders/${order.id}`} method="post">
                    <input type="hidden" name="_method" value="PUT" />
                    <input type="hidden" name="shop_id" value={shopId} />
                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Customer Information */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Customer Information</CardTitle>
                                <CardDescription>
                                    Update customer details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="customer.phone">
                                            Phone Number{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="customer.phone"
                                                name="customer[phone]"
                                                type="tel"
                                                placeholder="01712345678"
                                                value={phone}
                                                onChange={(e) =>
                                                    handlePhoneChange(
                                                        e.target.value,
                                                    )
                                                }
                                                maxLength={11}
                                                required
                                            />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            11 digits, starts with 01
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customer.name">
                                            Customer Name{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="customer.name"
                                            name="customer[name]"
                                            value={customerName}
                                            onChange={(e) =>
                                                setCustomerName(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="customer.address">
                                        Address
                                    </Label>
                                    <Input
                                        id="customer.address"
                                        name="customer[address]"
                                        value={customerAddress}
                                        onChange={(e) =>
                                            setCustomerAddress(e.target.value)
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="shop_id">
                                        Shop{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        name="shop_id"
                                        value={shopId}
                                        onValueChange={setShopId}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {shops.map((shop) => (
                                                <SelectItem
                                                    key={shop.id}
                                                    value={shop.id}
                                                >
                                                    {shop.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="delivery_date">
                                        Delivery Date{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="delivery_date"
                                        name="delivery_date"
                                        type="date"
                                        value={deliveryDate}
                                        onChange={(e) =>
                                            setDeliveryDate(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="delivery_address">
                                        Delivery Address
                                    </Label>
                                    <Input
                                        id="delivery_address"
                                        name="delivery_address"
                                        defaultValue={
                                            order.delivery_address || ''
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Order Items</CardTitle>
                                        <CardDescription>
                                            Update products in the order
                                        </CardDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addItem}
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
                                            <div className="space-y-2 md:col-span-3">
                                                <Label>Product Type</Label>
                                                <Select
                                                    name={`items[${index}][product_type_id]`}
                                                    value={item.product_type_id}
                                                    onValueChange={(value) =>
                                                        updateItem(
                                                            index,
                                                            'product_type_id',
                                                            value,
                                                        )
                                                    }
                                                    required
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {productTypes.map(
                                                            (type) => (
                                                                <SelectItem
                                                                    key={
                                                                        type.id
                                                                    }
                                                                    value={
                                                                        type.id
                                                                    }
                                                                >
                                                                    {type.name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Size</Label>
                                                <Select
                                                    name={`items[${index}][product_size_id]`}
                                                    value={item.product_size_id}
                                                    onValueChange={(value) =>
                                                        updateItem(
                                                            index,
                                                            'product_size_id',
                                                            value,
                                                        )
                                                    }
                                                    disabled={
                                                        !item.product_type_id
                                                    }
                                                    required
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {getAvailableSizes(
                                                            item.product_type_id,
                                                        ).map((size) => (
                                                            <SelectItem
                                                                key={size.id}
                                                                value={size.id}
                                                            >
                                                                {
                                                                    size.size_label
                                                                }
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Quantity</Label>
                                                <Input
                                                    type="number"
                                                    name={`items[${index}][quantity]`}
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            'quantity',
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 0,
                                                        )
                                                    }
                                                    min={1}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Price</Label>
                                                <Input
                                                    type="number"
                                                    name={`items[${index}][price]`}
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            'price',
                                                            parseFloat(
                                                                e.target.value,
                                                            ) || 0,
                                                        )
                                                    }
                                                    min={0}
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Subtotal</Label>
                                                <Input
                                                    value={`৳${(item.quantity * item.price).toFixed(2)}`}
                                                    disabled
                                                />
                                            </div>
                                            <div className="flex items-end md:col-span-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        removeItem(index)
                                                    }
                                                    disabled={
                                                        items.length === 1
                                                    }
                                                >
                                                    <Minus className="size-4" />
                                                </Button>
                                            </div>
                                            <div className="space-y-2 md:col-span-12">
                                                <Label>Notes (optional)</Label>
                                                <Input
                                                    name={`items[${index}][notes]`}
                                                    value={item.notes || ''}
                                                    onChange={(e) =>
                                                        updateItem(
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

                        {/* Discount */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Discount</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="discount_type">
                                            Discount Type
                                        </Label>
                                        <Select
                                            name="discount_type"
                                            value={discountType}
                                            onValueChange={(value) =>
                                                setDiscountType(
                                                    value as
                                                        | 'fixed'
                                                        | 'percentage',
                                                )
                                            }
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
                                    <div className="space-y-2">
                                        <Label htmlFor="discount_amount">
                                            Discount{' '}
                                            {discountType === 'percentage' &&
                                                '(%)'}
                                        </Label>
                                        <Input
                                            id="discount_amount"
                                            name="discount_amount"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={discountAmount}
                                            onChange={(e) =>
                                                setDiscountAmount(
                                                    e.target.value === ''
                                                        ? 0
                                                        : parseFloat(
                                                              e.target.value,
                                                          ),
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>
                                        ৳{calculateSubtotal().toFixed(2)}
                                    </span>
                                </div>
                                {calculateDiscount() > 0 && (
                                    <div className="flex justify-between text-sm text-orange-600">
                                        <span>
                                            Discount{' '}
                                            {discountType === 'percentage' &&
                                                `(${discountAmount}%)`}
                                            :
                                        </span>
                                        <span>
                                            -৳{calculateDiscount().toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                                    <span>Total:</span>
                                    <span>৳{calculateTotal().toFixed(2)}</span>
                                </div>
                                {parseFloat(order.advance_paid) > 0 && (
                                    <>
                                        <div className="flex justify-between pt-2 text-sm text-blue-600">
                                            <span>Paid:</span>
                                            <span>
                                                ৳
                                                {parseFloat(
                                                    order.advance_paid,
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Due:</span>
                                            <span>
                                                ৳
                                                {Math.max(
                                                    0,
                                                    calculateTotal() -
                                                        parseFloat(
                                                            order.advance_paid,
                                                        ),
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className="space-y-2 pt-4">
                                    <Button type="submit" className="w-full">
                                        Update Order
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </Form>
            </div>
        </AppLayout>
    );
}
