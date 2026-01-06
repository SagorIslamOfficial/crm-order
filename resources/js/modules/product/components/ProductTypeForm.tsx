import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ProductTypeForm } from '../types';

interface ProductTypeFormProps {
    data: ProductTypeForm;
    errors: Record<string, string>;
    processing: boolean;
    onChange: (field: keyof ProductTypeForm, value: string | boolean) => void;
    onSubmit: () => void;
    submitLabel?: string;
}

export function ProductTypeFormComponent({
    data,
    errors,
    processing,
    onChange,
    onSubmit,
    submitLabel = 'Save Product Type',
}: ProductTypeFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    placeholder="Product type name"
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="Product type description"
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
