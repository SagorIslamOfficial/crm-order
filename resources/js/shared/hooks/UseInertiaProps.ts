import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

export function useInertiaProps<T extends PageProps = PageProps>() {
    const { props } = usePage<T>();
    return props;
}
