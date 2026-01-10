import { FormActions, InfoCard } from '@/components/common';
import { index as shopsIndex } from '@/routes/shops';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { ShopFormFields } from './components';
import { useShopForm } from './hooks';
import type { Shop } from './types';

interface ShopEditFormProps {
    shop: Shop;
    className?: string;
}

export function ShopEditForm({ shop, className }: ShopEditFormProps) {
    const { data, errors, processing, updateField, submit } = useShopForm({
        code: shop.code || '',
        name: shop.name || '',
        address: shop.address || '',
        phone: shop.phone || '',
        website: shop.website || '',
        details: shop.details || '',
        is_active: !!shop.is_active,
        next_order_sequence: shop.next_order_sequence || 1,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submit('PUT', shop.id);
            toast.success('Shop updated successfully');
        } catch (error) {
            console.error('Failed to update shop:', error);
            toast.error('Failed to update shop');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            <InfoCard title="Shop Details">
                <ShopFormFields
                    data={data}
                    errors={errors}
                    onChange={updateField}
                />
            </InfoCard>

            <FormActions
                onCancel={() => router.visit(shopsIndex().url)}
                submitLabel="Update Shop"
                isProcessing={processing}
                className="mt-6"
            />
        </form>
    );
}
