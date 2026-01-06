import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { ProductSizeForm, ProductType } from '../types';

interface ProductSizeFormProps {
    data: ProductSizeForm;
    errors: Record<string, string>;
    processing: boolean;
    productTypes: ProductType[];
    onChange: (
        field: keyof ProductSizeForm,
        value: string | number | boolean,
    ) => void;
    onSubmit: () => void;
    submitLabel?: string;
}

export function ProductSizeFormComponent({
    data,
    errors,
    processing,
    productTypes,
    onChange,
    onSubmit,
    submitLabel = 'Save Product Size',
}: ProductSizeFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="product_type_id">Product Type *</Label>
                <Select
                    value={data.product_type_id}
                    onValueChange={(value) =>
                        onChange('product_type_id', value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a product type" />
                    </SelectTrigger>
                    <SelectContent>
                        {productTypes.map((productType) => (
                            <SelectItem
                                key={productType.id}
                                value={productType.id}
                            >
                                {productType.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.product_type_id} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="size_label">Size Label *</Label>
                <Input
                    id="size_label"
                    type="text"
                    value={data.size_label}
                    onChange={(e) => onChange('size_label', e.target.value)}
                    placeholder="e.g., Small, Medium, Large"
                    required
                />
                <InputError message={errors.size_label} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.price}
                    onChange={(e) =>
                        onChange('price', parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                    required
                />
                <InputError message={errors.price} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="Product size description"
                    rows={3}
                />
                <InputError message={errors.description} />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) =>
                        onChange('is_active', !!checked)
                    }
                />
                <Label htmlFor="is_active">Active</Label>
            </div>

            <InputError message={errors.general} />

            <div className="flex justify-end gap-4">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
