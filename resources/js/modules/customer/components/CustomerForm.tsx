import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import type { CustomerForm } from '../types';

interface CustomerFormProps {
  data: CustomerForm;
  errors: Record<string, string>;
  processing: boolean;
  onChange: (field: keyof CustomerForm, value: string) => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export function CustomerFormComponent({
  data,
  errors,
  processing,
  onChange,
  onSubmit,
  submitLabel = 'Save Customer'
}: CustomerFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="01xxxxxxxxx"
          required
        />
        <InputError message={errors.phone} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          type="text"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Customer name"
          required
        />
        <InputError message={errors.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={data.address}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Customer address"
          rows={3}
        />
        <InputError message={errors.address} />
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
