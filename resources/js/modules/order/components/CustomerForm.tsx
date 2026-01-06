import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerFormProps {
    phone: string;
    customerName: string;
    customerAddress: string;
    onPhoneChange: (value: string) => void;
    onNameChange: (value: string) => void;
    onAddressChange: (value: string) => void;
    description?: string;
}

export function CustomerForm({
    phone,
    customerName,
    customerAddress,
    onPhoneChange,
    onNameChange,
    onAddressChange,
    description = 'Enter customer details',
}: CustomerFormProps) {
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="customer.phone">
                            Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="customer.phone"
                            name="customer[phone]"
                            type="tel"
                            placeholder="01712345678"
                            value={phone}
                            onChange={(e) => onPhoneChange(e.target.value)}
                            maxLength={11}
                            required
                        />
                        <p className="text-sm text-muted-foreground">
                            11 digits, starts with 01
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="customer.name">
                            Customer Name{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="customer.name"
                            name="customer[name]"
                            value={customerName}
                            onChange={(e) => onNameChange(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="customer.address">Address</Label>
                    <Input
                        id="customer.address"
                        name="customer[address]"
                        value={customerAddress}
                        onChange={(e) => onAddressChange(e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
