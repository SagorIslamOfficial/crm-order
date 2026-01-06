import { Button } from '@/components/ui/button';
import { CustomerForm } from '@/modules/order/components/CustomerForm';
import { OrderDetails } from '@/modules/order/components/OrderDetails';
import { OrderItemsFormTable } from '@/modules/order/components/OrderItemsFormTable';
import { OrderSummary } from '@/modules/order/components/OrderSummary';
import { PaymentAndDiscountSection } from '@/modules/order/components/PaymentAndDiscountSection';
import type {
    CreateOrderPageProps,
    OrderItemFormData,
} from '@/modules/order/types';
import { dashboard } from '@/routes';
import { index as ordersIndex, store as ordersStore } from '@/routes/orders';
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
    {
        title: 'Create',
        href: '#',
    },
];

export default function CreateOrder({
    shops,
    productTypes,
}: CreateOrderPageProps) {
    const [items, setItems] = useState<OrderItemFormData[]>([
        { product_type_id: '', product_size_id: '', quantity: 1, price: 0 },
    ]);
    const [phone, setPhone] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [shopId, setShopId] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>(
        'fixed',
    );
    const [discountAmount, setDiscountAmount] = useState<string | number>(0);
    const [paymentMethod, setPaymentMethod] = useState('none');
    const [paymentAmount, setPaymentAmount] = useState<string | number>(0);
    const [transactionId, setTransactionId] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [mfsProvider, setMfsProvider] = useState('');
    const [mfsNumber, setMfsNumber] = useState('');
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
            title="Create Order"
            description="Add a new order to the system"
            breadcrumbs={breadcrumbs}
            backButton={{
                href: ordersIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <Form action={ordersStore().url} method="post">
                <div className="grid gap-4 lg:grid-cols-3">
                    <CustomerForm
                        phone={phone}
                        customerName={customerName}
                        customerAddress={customerAddress}
                        onPhoneChange={handlePhoneChange}
                        onNameChange={setCustomerName}
                        onAddressChange={setCustomerAddress}
                        description="Enter customer details"
                    />

                    <OrderDetails
                        shopId={shopId}
                        deliveryDate={deliveryDate}
                        deliveryAddress={deliveryAddress}
                        shops={shops}
                        onShopChange={setShopId}
                        onDeliveryDateChange={setDeliveryDate}
                        onDeliveryAddressChange={setDeliveryAddress}
                        minDate={new Date().toISOString().split('T')[0]}
                    />

                    <OrderItemsFormTable
                        items={items}
                        productTypes={productTypes}
                        onAddItem={addItem}
                        onRemoveItem={removeItem}
                        onUpdateItem={updateItem}
                        onUpdateMultiple={updateMultiple}
                        description="Add products to the order"
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
                    />

                    <OrderSummary
                        subtotal={calculateSubtotal()}
                        discount={calculateDiscount()}
                        total={calculateTotal()}
                        discountType={discountType}
                        discountAmount={discountAmount}
                        paidAmount={
                            paymentMethod !== 'none'
                                ? typeof paymentAmount === 'string'
                                    ? parseFloat(paymentAmount)
                                    : paymentAmount
                                : 0
                        }
                    >
                        <div className="grid gap-4 pt-4 lg:grid-cols-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>

                            <Button type="submit">Create Order</Button>
                        </div>
                    </OrderSummary>
                </div>
            </Form>
        </MainPageLayout>
    );
}
