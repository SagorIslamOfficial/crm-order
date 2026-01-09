import { InputField } from '@/components/common/InputField';
import type { ProductTypeForm } from '@/components/modules/product/type/types/Product.types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface BasicEditProps {
    data: ProductTypeForm;
    errors?: Partial<Record<keyof ProductTypeForm, string>>;
    onChange: <K extends keyof ProductTypeForm>(
        field: K,
        value: ProductTypeForm[K],
    ) => void;
}

export function BasicEdit({ data, errors, onChange }: BasicEditProps) {
    return (
        <div className="space-y-6">
            <InputField
                id="name"
                label="Name"
                value={data.name}
                onChange={(e) => onChange('name', e.target.value)}
                error={errors?.name}
                required
                helperText="The name of the product type"
            />

            <InputField
                textarea
                id="description"
                label="Description"
                value={data.description || ''}
                onChange={(e) => onChange('description', e.target.value)}
                rows={4}
                placeholder="Enter product type description..."
                error={errors?.description}
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
            {errors?.is_active && (
                <p className="text-xs font-medium text-destructive">
                    {errors.is_active}
                </p>
            )}
        </div>
    );
}
