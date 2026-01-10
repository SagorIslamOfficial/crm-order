import { CommonDataTable } from '@/components/common/data-table/CommonDataTable';
import { InfoCard } from '@/components/common/InfoCard';
import type {
    PaginatedData,
    ProductSize,
} from '@/components/modules/product/type/types/Product.types';
import { useSizeColumns } from './UseSizeColumns';

interface SizesViewProps {
    sizes: PaginatedData<ProductSize>;
    className?: string;
}

export function SizesView({ sizes, className }: SizesViewProps) {
    const columns = useSizeColumns();

    return (
        <div className={className}>
            <InfoCard title="Product Sizes">
                <CommonDataTable columns={columns} data={sizes} />
            </InfoCard>
        </div>
    );
}
