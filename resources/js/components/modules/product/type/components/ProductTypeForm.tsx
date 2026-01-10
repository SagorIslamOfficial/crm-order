import { InputField } from '@/components/common/InputField';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { ProductTypeForm } from '../types';

interface ProductTypeFormProps {
    data: ProductTypeForm;
    errors: Record<string, string>;
    processing?: boolean;
    onChange: <K extends keyof ProductTypeForm>(
        field: K,
        value: ProductTypeForm[K],
    ) => void;
    onSubmit?: () => void;
    submitLabel?: string;
    showSubmitButton?: boolean;
}

export function ProductTypeFormComponent({
    data,
    errors,
    processing = false,
    onChange,
    onSubmit,
    submitLabel = 'Save Product Type',
    showSubmitButton = false,
}: ProductTypeFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
                id="name"
                label="Name"
                type="text"
                name="name"
                value={data.name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Product type name"
                error={errors.name}
                required
            />

            <InputField
                textarea
                id="description"
                label="Description"
                name="description"
                value={data.description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder="Product type description"
                rows={3}
                error={errors.description}
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
                <Label htmlFor="is_active">Active</Label>
            </div>

            {showSubmitButton && (
                <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : submitLabel}
                    </Button>
                </div>
            )}
        </form>
    );
}
