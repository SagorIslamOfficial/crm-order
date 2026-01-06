import { Button } from '@/components/ui/button';
import { CustomerForm } from '@/modules/order/components/CustomerForm';
import { OrderDetails } from '@/modules/order/components/OrderDetails';
import { OrderItemsFormTable } from '@/modules/order/components/OrderItemsFormTable';
import { OrderSummary } from '@/modules/order/components/OrderSummary';
import { PaymentAndDiscountSection } from '@/modules/order/components/PaymentAndDiscountSection';
import type {
    EditOrderPageProps,
    OrderItemFormData,
} from '@/modules/order/types';
import { dashboard } from '@/routes';
import {
    index as ordersIndex,
    show as ordersShow,
    update as ordersUpdate,
} from '@/routes/orders';
import { MainPageLayout } from '@/shared/components/layout/MainPageLayout';
import { type BreadcrumbItem } from '@/types';
import { Form } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Orders',
        href: ordersIndex().url,
    },
];
export default function EditOrder({
    order,
    shops,
    productTypes,
}: EditOrderPageProps) {
    const [shopId, setShopId] = useState(order.shop_id);

    const [deliveryDate, setDeliveryDate] = useState(() => {
        if (!order.delivery_date) return '';
        return order.delivery_date.split(' ')[0];
    });

    const [deliveryAddress, setDeliveryAddress] = useState(
        order.delivery_address || '',
    );

    const [items, setItems] = useState<OrderItemFormData[]>(
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

    const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>(
        (order.discount_type as 'fixed' | 'percentage') || 'fixed',
    );

    const [discountAmount, setDiscountAmount] = useState<string | number>(
        () => {
            const storedAmount = parseFloat(
                order.discount_amount?.toString() || '0',
            );

            if (order.discount_type === 'percentage') {
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

                if (subtotal > 0) {
                    const percentage = (storedAmount / subtotal) * 100;
                    return Math.round(percentage * 100) / 100;
                }
            }

            return storedAmount;
        },
    );

    const [paymentMethod, setPaymentMethod] = useState(() => {
        if (order.advance_paid && parseFloat(order.advance_paid) > 0) {
            if (order.payments && order.payments.length > 0) {
                const lastPayment = order.payments[order.payments.length - 1];
                return lastPayment.method || 'none';
            }
        }
        return 'none';
    });
    const [paymentAmount, setPaymentAmount] = useState<string | number>(() =>
        parseFloat(order.advance_paid || '0'),
    );
    const [transactionId, setTransactionId] = useState(() => {
        if (order.payments && order.payments.length > 0) {
            return (
                order.payments[order.payments.length - 1].transaction_id || ''
            );
        }
        return '';
    });
    const [bankName, setBankName] = useState(() => {
        if (order.payments && order.payments.length > 0) {
            return order.payments[order.payments.length - 1].bank_name || '';
        }
        return '';
    });
    const [accountNumber, setAccountNumber] = useState(() => {
        if (order.payments && order.payments.length > 0) {
            return (
                order.payments[order.payments.length - 1].account_number || ''
            );
        }
        return '';
    });
    const [mfsProvider, setMfsProvider] = useState(() => {
        if (order.payments && order.payments.length > 0) {
            return order.payments[order.payments.length - 1].mfs_provider || '';
        }
        return '';
    });
    const [mfsNumber, setMfsNumber] = useState(() => {
        if (order.payments && order.payments.length > 0) {
            return order.payments[order.payments.length - 1].mfs_number || '';
        }
        return '';
    });

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
            const data: {
                found: boolean;
                customer?: {
                    id: string;
                    name: string;
                    phone: string;
                    address: string | null;
                };
            } = await response.json();

            if (data.found) {
                setCustomerName(data.customer!.name);
                setCustomerAddress(data.customer!.address || '');
            }
        } catch (error) {
            console.error('Error searching customer:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handlePhoneChange = (value: string) => {
        setPhone(value);
        setCustomerName('');
        setCustomerAddress('');
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
        field: keyof OrderItemFormData,
        value: string | number,
    ) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const updateMultiple = (
        index: number,
        updates: Partial<OrderItemFormData>,
    ) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], ...updates };
        setItems(newItems);
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
        <MainPageLayout
            title={`Edit Order ${order.order_number}`}
            description={`Order from ${order.customer.name}`}
            breadcrumbs={[
                ...breadcrumbs,
                {
                    title: order.order_number,
                    href: ordersShow(order.id).url,
                },
                {
                    title: 'Edit',
                    href: '#',
                },
            ]}
            backButton={{
                href: ordersShow(order.id).url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <Form action={ordersUpdate(order.id).url} method="post">
                <input type="hidden" name="_method" value="PUT" />
                <div className="grid gap-4 lg:grid-cols-3">
                    <CustomerForm
                        phone={phone}
                        customerName={customerName}
                        customerAddress={customerAddress}
                        onPhoneChange={handlePhoneChange}
                        onNameChange={setCustomerName}
                        onAddressChange={setCustomerAddress}
                        description="Update customer details"
                    />

                    <OrderDetails
                        shopId={shopId}
                        deliveryDate={deliveryDate}
                        deliveryAddress={deliveryAddress}
                        shops={shops}
                        onShopChange={setShopId}
                        onDeliveryDateChange={setDeliveryDate}
                        onDeliveryAddressChange={setDeliveryAddress}
                    />

                    <OrderItemsFormTable
                        items={items}
                        productTypes={productTypes}
                        onAddItem={addItem}
                        onRemoveItem={removeItem}
                        onUpdateItem={updateItem}
                        onUpdateMultiple={updateMultiple}
                        description="Update products in the order"
                    />

                    <PaymentAndDiscountSection
                        discountType={discountType}
                        discountAmount={discountAmount}
                        paymentMethod={paymentMethod}
                        paymentAmount={paymentAmount}
                        transactionId={transactionId}
                        bankName={bankName}
                        accountNumber={accountNumber}
                        mfsProvider={mfsProvider}
                        mfsNumber={mfsNumber}
                        onDiscountTypeChange={(value) => {
                            setDiscountType(value);
                            setDiscountAmount(0);
                        }}
                        onDiscountAmountChange={setDiscountAmount}
                        onPaymentMethodChange={setPaymentMethod}
                        onPaymentAmountChange={setPaymentAmount}
                        onTransactionIdChange={setTransactionId}
                        onBankNameChange={setBankName}
                        onAccountNumberChange={setAccountNumber}
                        onMfsProviderChange={setMfsProvider}
                        onMfsNumberChange={setMfsNumber}
                        isReadOnlyPayment={true}
                    />

                    <OrderSummary
                        subtotal={calculateSubtotal()}
                        discount={calculateDiscount()}
                        total={calculateTotal()}
                        discountType={discountType}
                        discountAmount={discountAmount}
                        paidAmount={parseFloat(order.advance_paid || '0')}
                    >
                        <div className="grid gap-4 pt-4 lg:grid-cols-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>

                            <Button type="submit">Update Order</Button>
                        </div>
                    </OrderSummary>
                </div>
            </Form>
        </MainPageLayout>
    );
}
