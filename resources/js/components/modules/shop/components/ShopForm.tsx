import { InputField } from '@/components/common/InputField';
import type { ShopForm } from '@/components/modules/shop/types/Shop.types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ShopFormFieldsProps {
    data: ShopForm;
    errors?: Partial<Record<keyof ShopForm, string>>;
    onChange: <K extends keyof ShopForm>(field: K, value: ShopForm[K]) => void;
}

export function ShopFormFields({
    data,
    errors,
    onChange,
}: ShopFormFieldsProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <InputField
                    label="Shop Code"
                    id="code"
                    value={data.code}
                    error={errors?.code}
                    onChange={(e) => onChange('code', e.target.value)}
                    required
                    placeholder="e.g., SHP01"
                />

                <InputField
                    label="Shop Name"
                    id="name"
                    value={data.name}
                    error={errors?.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    required
                    placeholder="Enter shop name"
                />
            </div>

            <InputField
                label="Address"
                id="address"
                value={data.address}
                error={errors?.address}
                onChange={(e) => onChange('address', e.target.value)}
                required
                placeholder="Enter shop address"
                type="text"
            />

            <div className="grid gap-6 md:grid-cols-2">
                <InputField
                    label="Phone"
                    id="phone"
                    value={data.phone}
                    error={errors?.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                    required
                    placeholder="Enter phone number"
                />

                <InputField
                    label="Website"
                    id="website"
                    value={data.website || ''}
                    error={errors?.website}
                    onChange={(e) => onChange('website', e.target.value)}
                    placeholder="www.example.com"
                />
            </div>

            <InputField
                label="Additional Details"
                id="details"
                value={data.details || ''}
                error={errors?.details}
                onChange={(e) => onChange('details', e.target.value)}
                placeholder="Any additional information about the shop"
            />

            <InputField
                label="Next Order Sequence"
                id="next_order_sequence"
                type="number"
                value={data.next_order_sequence.toString()}
                error={errors?.next_order_sequence}
                onChange={(e) =>
                    onChange(
                        'next_order_sequence',
                        parseInt(e.target.value) || 0,
                    )
                }
                required
                placeholder="1"
                helperText="The sequence number for the next order at this shop"
            />

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) =>
                        onChange('is_active', !!checked)
                    }
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                    Active
                </Label>
            </div>
        </div>
    );
}
