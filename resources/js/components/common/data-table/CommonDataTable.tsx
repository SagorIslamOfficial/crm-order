import { DataTable } from '@/components/common';
import { router } from '@inertiajs/react';
import type { ColumnDef, Table } from '@tanstack/react-table';

interface PaginationData<T> {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    data: T[];
}

interface CommonDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: PaginationData<TData>;
    globalFilterValue?: string;
    onGlobalFilterChange?: (value: string) => void;
    onTableChange?: (table: Table<TData>) => void;
    loading?: boolean;
}

export function CommonDataTable<TData, TValue>({
    data,
    ...props
}: CommonDataTableProps<TData, TValue>) {
    return (
        <DataTable
            data={data?.data ?? []}
            pagination={
                data
                    ? {
                          current_page: data.current_page,
                          last_page: data.last_page,
                          total: data.total,
                          per_page: data.per_page,
                          links: data.links,
                      }
                    : undefined
            }
            onPageChange={(url) => router.visit(url)}
            {...props}
        />
    );
}
