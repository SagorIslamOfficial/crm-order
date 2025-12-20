import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface PaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderId: string;
    dueAmount: string;
}

export default function PaymentModal({
    open,
    onOpenChange,
    orderId,
    dueAmount,
}: PaymentModalProps) {
    const [method, setMethod] = useState('cash');
    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [mfsProvider, setMfsProvider] = useState('');
    const [mfsNumber, setMfsNumber] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid payment amount');
            return;
        }

        if (parseFloat(amount) > parseFloat(dueAmount)) {
            alert('Payment amount cannot exceed due amount');
            return;
        }

        // Validate MFS fields when method is bKash or Nagad
        if ((method === 'bkash' || method === 'nagad') && !mfsProvider) {
            alert('Please select a provider type');
            return;
        }

        if ((method === 'bkash' || method === 'nagad') && !mfsNumber) {
            alert('Please enter MFS phone number');
            return;
        }

        // Validate Bank fields when method is bank
        if (method === 'bank' && !bankName) {
            alert('Please enter bank name');
            return;
        }

        if (method === 'bank' && !accountNumber) {
            alert('Please enter account number');
            return;
        }

        setProcessing(true);

        router.post(
            `/orders/${orderId}/payments`,
            {
                method,
                amount: parseFloat(amount),
                transaction_id: transactionId || null,
                bank_name: bankName || null,
                account_number: accountNumber || null,
                mfs_provider: mfsProvider || null,
                mfs_number: mfsNumber || null,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    setAmount('');
                    setTransactionId('');
                    setBankName('');
                    setAccountNumber('');
                    setMfsProvider('');
                    setMfsNumber('');
                    setMethod('cash');
                },
                onError: (errors) => {
                    console.error('Payment error:', errors);
                    alert('Error adding payment. Please try again.');
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    const requiresTransactionId = ['bkash', 'nagad', 'bank'].includes(method);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Payment</DialogTitle>
                        <DialogDescription>
                            Add a new payment for this order. Due amount: ৳
                            {dueAmount}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="method">
                                Payment Method{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={method}
                                onValueChange={setMethod}
                                required
                            >
                                <SelectTrigger id="method">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="bkash">bKash</SelectItem>
                                    <SelectItem value="nagad">Nagad</SelectItem>
                                    <SelectItem value="bank">
                                        Bank Transfer
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="amount">
                                Amount (৳){' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                max={dueAmount}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                Maximum: ৳{dueAmount}
                            </p>
                        </div>

                        {requiresTransactionId && (
                            <div className="grid gap-2">
                                <Label htmlFor="transaction_id">
                                    Transaction ID{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="transaction_id"
                                    value={transactionId}
                                    onChange={(e) =>
                                        setTransactionId(e.target.value)
                                    }
                                    placeholder="Enter transaction ID"
                                    required={requiresTransactionId}
                                />
                            </div>
                        )}

                        {/* Bank Transfer Fields */}
                        {method === 'bank' && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="bank_name">
                                        Bank Name{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="bank_name"
                                        value={bankName}
                                        onChange={(e) =>
                                            setBankName(e.target.value)
                                        }
                                        placeholder="e.g., Dhaka Bank, Islami Bank"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="account_number">
                                        Account Number{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="account_number"
                                        value={accountNumber}
                                        onChange={(e) =>
                                            setAccountNumber(e.target.value)
                                        }
                                        placeholder="Bank account number"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* MFS Fields (bKash, Nagad) */}
                        {(method === 'bkash' || method === 'nagad') && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="mfs_provider">
                                        Provider{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={mfsProvider}
                                        onValueChange={setMfsProvider}
                                        required
                                    >
                                        <SelectTrigger id="mfs_provider">
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {method === 'bkash' && (
                                                <>
                                                    <SelectItem value="bkash_personal">
                                                        bKash Personal
                                                    </SelectItem>
                                                    <SelectItem value="bkash_merchant">
                                                        bKash Merchant
                                                    </SelectItem>
                                                </>
                                            )}
                                            {method === 'nagad' && (
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
                                <div className="grid gap-2">
                                    <Label htmlFor="mfs_number">
                                        Phone Number{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="mfs_number"
                                        value={mfsNumber}
                                        onChange={(e) =>
                                            setMfsNumber(e.target.value)
                                        }
                                        placeholder="01712345678"
                                        maxLength={11}
                                        required
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Adding...' : 'Add Payment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
