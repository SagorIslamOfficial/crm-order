import { InputField } from '@/components/common/InputField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Shop } from '../types';

interface OrderDetailsProps {
    shopId: string;
    deliveryDate: string;
    deliveryAddress: string;
    shops: Shop[];
    onShopChange: (value: string) => void;
    onDeliveryDateChange: (value: string) => void;
    onDeliveryAddressChange: (value: string) => void;
    minDate?: string;
}

export function OrderDetails({
    shopId,
    deliveryDate,
    deliveryAddress,
    shops,
    onShopChange,
    onDeliveryDateChange,
    onDeliveryAddressChange,
    minDate,
}: OrderDetailsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="shop_id">
                        Shop <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        name="shop_id"
                        value={shopId}
                        onValueChange={onShopChange}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select shop" />
                        </SelectTrigger>
                        <SelectContent>
                            {shops.map((shop) => (
                                <SelectItem key={shop.id} value={shop.id}>
                                    {shop.name} ({shop.code})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <InputField
                    id="delivery_date"
                    name="delivery_date"
                    label="Delivery Date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => onDeliveryDateChange(e.target.value)}
                    min={minDate}
                    required
                />

                <InputField
                    id="delivery_address"
                    name="delivery_address"
                    label="Delivery Address"
                    value={deliveryAddress}
                    onChange={(e) => onDeliveryAddressChange(e.target.value)}
                />
            </CardContent>
        </Card>
    );
}
