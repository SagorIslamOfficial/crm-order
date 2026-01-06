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

interface PaymentAndDiscountSectionProps {
    discountType: 'fixed' | 'percentage';
    discountAmount: number | string;
    paymentMethod: string;
    paymentAmount: number | string;
    transactionId: string;
    bankName: string;
    accountNumber: string;
    mfsProvider: string;
    mfsNumber: string;
    onDiscountTypeChange: (value: 'fixed' | 'percentage') => void;
    onDiscountAmountChange: (value: number | string) => void;
    onPaymentMethodChange: (value: string) => void;
    onPaymentAmountChange: (value: number | string) => void;
    onTransactionIdChange: (value: string) => void;
    onBankNameChange: (value: string) => void;
    onAccountNumberChange: (value: string) => void;
    onMfsProviderChange: (value: string) => void;
    onMfsNumberChange: (value: string) => void;
    isReadOnlyPayment?: boolean;
}

export function PaymentAndDiscountSection({
    discountType,
    discountAmount,
    paymentMethod,
    paymentAmount,
    transactionId,
    bankName,
    accountNumber,
    mfsProvider,
    mfsNumber,
    onDiscountTypeChange,
    onDiscountAmountChange,
    onPaymentMethodChange,
    onPaymentAmountChange,
    onTransactionIdChange,
    onBankNameChange,
    onAccountNumberChange,
    onMfsProviderChange,
    onMfsNumberChange,
    isReadOnlyPayment = false,
}: PaymentAndDiscountSectionProps) {
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Payment & Discount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Discount Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="discount_type">Discount Type</Label>
                        <Select
                            name="discount_type"
                            value={discountType}
                            onValueChange={(value) => {
                                onDiscountTypeChange(
                                    value as 'fixed' | 'percentage',
                                );
                                onDiscountAmountChange(0);
                            }}
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
                            Discount {discountType === 'percentage' && '(%)'}
                        </Label>
                        <Input
                            id="discount_amount"
                            name="discount_amount"
                            type="number"
                            min={0}
                            step="0.01"
                            value={discountAmount}
                            onChange={(e) =>
                                onDiscountAmountChange(
                                    parseFloat(e.target.value) || 0,
                                )
                            }
                        />
                    </div>
                </div>

                {/* Payment Section */}
                <div className="grid gap-4 md:grid-cols-3">
                    {isReadOnlyPayment ? (
                        // Read-only mode for edit page
                        <>
                            <div className="space-y-2">
                                <Label>Payment Status</Label>
                                <div className="flex items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
                                    <span className="text-sm">
                                        {paymentAmount &&
                                        parseFloat(paymentAmount.toString()) > 0
                                            ? `Paid: ৳${parseFloat(paymentAmount.toString()).toLocaleString()}`
                                            : 'Not Paid'}
                                    </span>
                                </div>
                            </div>
                            {paymentMethod && paymentMethod !== 'none' && (
                                <div className="space-y-2">
                                    <Label>Payment Method</Label>
                                    <div className="flex items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 capitalize dark:border-gray-800 dark:bg-gray-900">
                                        <span className="text-sm">
                                            {paymentMethod}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {transactionId && (
                                <div className="space-y-2">
                                    <Label>Transaction ID</Label>
                                    <div className="flex items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
                                        <span className="text-sm">
                                            {transactionId}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="col-span-full rounded-md border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    To add advance payment, please use the
                                    payment section in the order details view.
                                </p>
                            </div>
                        </>
                    ) : (
                        // Editable mode for create page
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="payment.method">
                                    Payment Method{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    name="payment[method]"
                                    value={paymentMethod}
                                    onValueChange={(value) => {
                                        onPaymentMethodChange(value);
                                        onBankNameChange('');
                                        onAccountNumberChange('');
                                        onMfsProviderChange('');
                                        onMfsNumberChange('');
                                    }}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
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

                            {paymentMethod && paymentMethod !== 'none' && (
                                <div className="space-y-2">
                                    <Label htmlFor="payment.amount">
                                        Advance Payment{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="payment.amount"
                                        name="payment[amount]"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={paymentAmount}
                                        onChange={(e) =>
                                            onPaymentAmountChange(
                                                parseFloat(e.target.value) || 0,
                                            )
                                        }
                                        required
                                    />
                                </div>
                            )}

                            {/* Transaction ID Field - Show for all payments except cash and none */}
                            {paymentMethod &&
                                paymentMethod !== 'cash' &&
                                paymentMethod !== 'none' && (
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
                                                onTransactionIdChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                )}
                        </>
                    )}
                </div>

                {/* Bank Transfer Fields - Only show in editable mode */}
                {!isReadOnlyPayment && paymentMethod === 'bank' && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="payment.bank_name">
                                Bank Name{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="payment.bank_name"
                                name="payment[bank_name]"
                                placeholder="e.g., Dhaka Bank, Islami Bank"
                                value={bankName}
                                onChange={(e) =>
                                    onBankNameChange(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment.account_number">
                                Account Number
                            </Label>
                            <Input
                                id="payment.account_number"
                                name="payment[account_number]"
                                placeholder="Bank account number"
                                value={accountNumber}
                                onChange={(e) =>
                                    onAccountNumberChange(e.target.value)
                                }
                            />
                        </div>
                    </div>
                )}

                {/* MFS Fields (bKash, Nagad) - Only show in editable mode */}
                {!isReadOnlyPayment &&
                    (paymentMethod === 'bkash' ||
                        paymentMethod === 'nagad') && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="payment.mfs_provider">
                                    Provider{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    name="payment[mfs_provider]"
                                    value={mfsProvider}
                                    onValueChange={onMfsProviderChange}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {paymentMethod === 'bkash' && (
                                            <>
                                                <SelectItem value="bkash_personal">
                                                    bKash Personal
                                                </SelectItem>
                                                <SelectItem value="bkash_merchant">
                                                    bKash Merchant
                                                </SelectItem>
                                            </>
                                        )}
                                        {paymentMethod === 'nagad' && (
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
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="payment.mfs_number"
                                    name="payment[mfs_number]"
                                    placeholder="01712345678"
                                    maxLength={11}
                                    value={mfsNumber}
                                    onChange={(e) =>
                                        onMfsNumberChange(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                    )}
            </CardContent>
        </Card>
    );
}
