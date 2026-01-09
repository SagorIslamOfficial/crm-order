import type { Shop } from '@/components/modules/shop/types/Shop.types';
import { OverviewView } from './view';

interface ShopShowProps {
    shop: Shop;
}

export function ShopShow({ shop }: ShopShowProps) {
    return <OverviewView shop={shop} />;
}
