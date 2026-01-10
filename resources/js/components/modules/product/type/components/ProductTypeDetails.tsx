import { InfoCard } from '@/components/common';
import type { ProductType } from '../types';

interface ProductTypeDetailsProps {
    productType: ProductType;
}

export function ProductTypeDetails({ productType }: ProductTypeDetailsProps) {
    const items = [
        {
            label: 'Name',
            value: <span className="font-semibold">{productType.name}</span>,
        },
        {
            label: 'Description',
            value: productType.description || '-',
            hidden: !productType.description,
        },
        {
            label: 'Status',
            value: productType.is_active ? 'Active' : 'Inactive',
        },
        {
            label: 'Sizes Count',
            value: productType.sizes_count || 0,
        },
        {
            label: 'Orders Count',
            value: productType.orders_count || 0,
        },
        {
            label: 'Created',
            value: new Date(productType.created_at).toLocaleDateString(
                'en-US',
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                },
            ),
        },
    ];

    return <InfoCard title="Product Type Information" items={items} />;
}
