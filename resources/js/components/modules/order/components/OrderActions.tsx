import { Button } from '@/components/ui/button';
import { Printer, RefreshCw } from 'lucide-react';

interface OrderActionsProps {
    onStatusClick: () => void;
    onPrintClick: (type: 'customer' | 'office' | 'tailor') => void;
}

export function OrderActions({
    onStatusClick,
    onPrintClick,
}: OrderActionsProps) {
    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onStatusClick}>
                <RefreshCw className="mr-2 size-4" />
                Update Status
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPrintClick('customer')}
            >
                <Printer className="mr-2 size-4" />
                Customer Copy
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPrintClick('office')}
            >
                <Printer className="mr-2 size-4" />
                Office Copy
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPrintClick('tailor')}
            >
                <Printer className="mr-2 size-4" />
                Tailor Copy
            </Button>
        </div>
    );
}
