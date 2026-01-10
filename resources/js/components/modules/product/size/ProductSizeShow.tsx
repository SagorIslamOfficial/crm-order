import type { ProductSize } from '@/components/modules/product/size/types/Product.types';
import { OverviewView } from './view';

interface ProductSizeShowProps {
    productSize: ProductSize;
}

export function ProductSizeShow({ productSize }: ProductSizeShowProps) {
    return <OverviewView productSize={productSize} />;
}
