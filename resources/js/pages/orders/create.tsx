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

interface CreateOrderPageProps extends PageProps {
    shops: Shop[];
    productTypes: ProductType[];
}

interface OrderItem {
    product_type_id: string;
    product_size_id: string;
    quantity: number;
    price: number;
    notes?: string;
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
    {
        title: 'Create',
        href: '/orders/create',
    },
];

export default function CreateOrder({
    shops,
    productTypes,
}: CreateOrderPageProps) {
    const [items, setItems] = useState<OrderItem[]>([
        { product_type_id: '', product_size_id: '', quantity: 1, price: 0 },
    ]);
    const [phone, setPhone] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>(
        'fixed',
    );
    const [discountAmount, setDiscountAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [mfsProvider, setMfsProvider] = useState('');
    const [mfsNumber, setMfsNumber] = useState('');
    const [transactionId, setTransactionId] = useState('');
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
        if (discountType === 'percentage') {
            return (subtotal * discountAmount) / 100;
        }
        return discountAmount;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Order" />
            <div className="flex flex-col gap-4 p-4">
                <Form action="/orders" method="post">
                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* Customer Information */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Customer Information</CardTitle>
                                <CardDescription>
                                    Enter customer details
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
                                    <Select name="shop_id" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select shop" />
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
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
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
                                            Add products to the order
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
                                                        <SelectValue placeholder="Select type" />
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
                                                        <SelectValue placeholder="Size" />
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
                                                    placeholder="Special instructions or measurements"
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

                        {/* Payment & Discount */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Payment & Discount</CardTitle>
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
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="payment.method">
                                            Payment Method{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            name="payment[method]"
                                            value={paymentMethod}
                                            onValueChange={(value) => {
                                                setPaymentMethod(value);
                                                // Clear related fields when method changes
                                                setBankName('');
                                                setAccountNumber('');
                                                setMfsProvider('');
                                                setMfsNumber('');
                                            }}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">
                                                    Cash
                                                </SelectItem>
                                                <SelectItem value="bkash">
                                                    bKash
                                                </SelectItem>
                                                <SelectItem value="nagad">
                                                    Nagad
                                                </SelectItem>
                                                <SelectItem value="bank">
                                                    Bank Transfer
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {paymentMethod && (
                                        <div className="space-y-2">
                                            <Label htmlFor="payment.amount">
                                                Advance Payment{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="payment.amount"
                                                name="payment[amount]"
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={paymentAmount}
                                                onChange={(e) =>
                                                    setPaymentAmount(
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Transaction ID Field - Show for all payments except cash */}
                                    {paymentMethod &&
                                        paymentMethod !== 'cash' && (
                                            <div className="space-y-2">
                                                <Label htmlFor="payment.transaction_id">
                                                    Transaction ID
                                                </Label>
                                                <Input
                                                    id="payment.transaction_id"
                                                    name="payment[transaction_id]"
                                                    placeholder="Enter transaction ID (optional)"
                                                    value={transactionId}
                                                    onChange={(e) =>
                                                        setTransactionId(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                </div>

                                {/* Bank Transfer Fields */}
                                {paymentMethod === 'bank' && (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="payment.bank_name">
                                                Bank Name{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="payment.bank_name"
                                                name="payment[bank_name]"
                                                placeholder="e.g., Dhaka Bank, Islami Bank"
                                                value={bankName}
                                                onChange={(e) =>
                                                    setBankName(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="payment.account_number">
                                                Account Number{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="payment.account_number"
                                                name="payment[account_number]"
                                                placeholder="Bank account number"
                                                value={accountNumber}
                                                onChange={(e) =>
                                                    setAccountNumber(
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* MFS Fields (bKash, Nagad) */}
                                {(paymentMethod === 'bkash' ||
                                    paymentMethod === 'nagad') && (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="payment.mfs_provider">
                                                Provider{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                name="payment[mfs_provider]"
                                                value={mfsProvider}
                                                onValueChange={setMfsProvider}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select provider" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paymentMethod ===
                                                        'bkash' && (
                                                        <>
                                                            <SelectItem value="bkash_personal">
                                                                bKash Personal
                                                            </SelectItem>
                                                            <SelectItem value="bkash_merchant">
                                                                bKash Merchant
                                                            </SelectItem>
                                                        </>
                                                    )}
                                                    {paymentMethod ===
                                                        'nagad' && (
                                                        <>
                                                            <SelectItem value="nagad_personal">
                                                                Nagad Personal
                                                            </SelectItem>
                                                            <SelectItem value="nagad_merchant">
                                                                Nagad Merchant
                                                            </SelectItem>
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="payment.mfs_number">
                                                Phone Number{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="payment.mfs_number"
                                                name="payment[mfs_number]"
                                                placeholder="01712345678"
                                                maxLength={11}
                                                value={mfsNumber}
                                                onChange={(e) =>
                                                    setMfsNumber(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
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
                                {paymentMethod && (
                                    <div className="space-y-2 border-t pt-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Method:
                                            </span>
                                            <span className="font-medium">
                                                {paymentMethod
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    paymentMethod.slice(1)}
                                            </span>
                                        </div>
                                        {mfsProvider && (
                                            <>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Type:
                                                    </span>
                                                    <span>
                                                        {mfsProvider
                                                            .split('_')[1]
                                                            .replace(
                                                                /\b\w/g,
                                                                (c) =>
                                                                    c.toUpperCase(),
                                                            )}
                                                    </span>
                                                </div>
                                                {mfsNumber && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Phone:
                                                        </span>
                                                        <span>{mfsNumber}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {bankName && (
                                            <>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Bank:
                                                    </span>
                                                    <span>{bankName}</span>
                                                </div>
                                                {accountNumber && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Account:
                                                        </span>
                                                        <span>
                                                            {accountNumber}
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                                {paymentMethod && paymentAmount > 0 && (
                                    <>
                                        <div className="flex justify-between pt-2 text-sm text-blue-600">
                                            <span>Paid:</span>
                                            <span>
                                                ৳{paymentAmount.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Due:</span>
                                            <span>
                                                ৳
                                                {Math.max(
                                                    0,
                                                    calculateTotal() -
                                                        paymentAmount,
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className="pt-4">
                                    <Button type="submit" className="w-full">
                                        Create Order
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
