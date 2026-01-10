import { InputField } from '@/components/common/InputField';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

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
                    <InputField
                        id="customer.phone"
                        name="customer[phone]"
                        label="Phone Number"
                        type="tel"
                        placeholder="01712345678"
                        value={phone}
                        onChange={(e) => onPhoneChange(e.target.value)}
                        required
                        maxLength={11}
                        helperText="11 digits, starts with 01"
                    />

                    <InputField
                        id="customer.name"
                        name="customer[name]"
                        label="Customer Name"
                        value={customerName}
                        onChange={(e) => onNameChange(e.target.value)}
                        required
                    />
                </div>

                <InputField
                    id="customer.address"
                    name="customer[address]"
                    label="Address"
                    value={customerAddress}
                    onChange={(e) => onAddressChange(e.target.value)}
                />
            </CardContent>
        </Card>
    );
}
