import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface StatusUpdateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderId: string;
    currentStatus: 'pending' | 'delivered' | 'cancelled';
}

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

const statusDescriptions: Record<string, string> = {
    pending: 'Order is awaiting processing or delivery',
    delivered: 'Order has been completed and delivered to customer',
    cancelled: 'Order has been cancelled and will not be fulfilled',
};

export default function StatusUpdateModal({
    open,
    onOpenChange,
    orderId,
    currentStatus,
}: StatusUpdateModalProps) {
    const [status, setStatus] = useState(currentStatus);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (status === currentStatus) {
            alert('Please select a different status');
            return;
        }

        // Show confirmation for critical status changes
        if (status === 'cancelled') {
            if (
                !confirm(
                    'Are you sure you want to cancel this order? This action may affect inventory and payments.',
                )
            ) {
                return;
            }
        }

        if (status === 'delivered' && currentStatus === 'cancelled') {
            if (
                !confirm(
                    'Are you sure you want to mark a cancelled order as delivered?',
                )
            ) {
                return;
            }
        }

        setProcessing(true);

        router.put(
            `/orders/${orderId}`,
            {
                status,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (errors) => {
                    console.error('Status update error:', errors);
                    alert('Error updating status. Please try again.');
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'pending':
                return 'text-yellow-600';
            case 'delivered':
                return 'text-green-600';
            case 'cancelled':
                return 'text-red-600';
            default:
                return '';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                        <DialogDescription>
                            Current status:{' '}
                            <span className={getStatusColor(currentStatus)}>
                                {statusLabels[currentStatus]}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="status">
                                New Status{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={status}
                                onValueChange={(value) =>
                                    setStatus(
                                        value as
                                            | 'pending'
                                            | 'delivered'
                                            | 'cancelled',
                                    )
                                }
                                required
                            >
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">
                                        <span className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-yellow-500" />
                                            Pending
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="delivered">
                                        <span className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-green-500" />
                                            Delivered
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        <span className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-red-500" />
                                            Cancelled
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">
                                {statusDescriptions[status]}
                            </p>
                        </div>

                        {status === 'cancelled' && (
                            <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
                                <div className="flex gap-2">
                                    <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
                                    <div className="text-sm text-red-800 dark:text-red-200">
                                        <p className="font-semibold">Warning</p>
                                        <p>
                                            Cancelling this order will prevent
                                            further payments and mark it as
                                            incomplete.
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                            {processing ? 'Updating...' : 'Update Status'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
