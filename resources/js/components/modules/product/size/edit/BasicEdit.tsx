import { InputField, SelectField } from '@/components/common';
import type { ProductSizeForm } from '@/components/modules/product/size/types/Product.types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface BasicEditProps {
    data: ProductSizeForm;
    errors?: Partial<Record<keyof ProductSizeForm, string>>;
    productTypes?: Array<{ id: string; name: string }>;
    onChange: (field: keyof ProductSizeForm, value: unknown) => void;
}

export function BasicEdit({
    data,
    errors,
    productTypes = [],
    onChange,
}: BasicEditProps) {
    return (
        <div className="space-y-6">
            <SelectField
                label="Product Type"
                value={data.product_type_id}
                onValueChange={(value) => onChange('product_type_id', value)}
                options={productTypes.map((type) => ({
                    label: type.name,
                    value: type.id,
                }))}
                placeholder="Select a product type"
                error={errors?.product_type_id}
                required
            />

            <InputField
                id="size_label"
                label="Size Label"
                name="size_label"
                value={data.size_label}
                onChange={(e) => onChange('size_label', e.target.value)}
                error={errors?.size_label}
                required
                helperText="e.g., Small, Medium, Large, XL"
            />

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is_active"
                    name="is_active"
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
