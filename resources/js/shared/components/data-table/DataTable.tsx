'use client';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type Table as ReactTable,
    type Row,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    globalFilterFn?: (
        row: Row<TData>,
        columnId: string,
        filterValue: string,
    ) => boolean;
    onGlobalFilterChange?: (value: string) => void;
    globalFilterValue?: string;
    onTableChange?: (table: ReactTable<TData>) => void;
    pagination?: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    onPageChange?: (url: string) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    globalFilterFn,
    globalFilterValue = '',
    onTableChange,
    pagination,
    onPageChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter: globalFilterValue,
        },
    });

    React.useEffect(() => {
        if (onTableChange) {
            onTableChange(table);
        }
    }, [table, onTableChange]);

    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No data found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between border-t bg-background px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                        Page {pagination.current_page} of {pagination.last_page}
                        {pagination.total && (
                            <span className="ml-2">of {pagination.total}</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {pagination.links.map((link) => {
                            const isDisabled =
                                !link.url || link.label.includes('Previous')
                                    ? pagination.current_page === 1
                                    : link.label.includes('Next')
                                      ? pagination.current_page ===
                                        pagination.last_page
                                      : false;

                            const isPrevNext =
                                link.label.includes('Previous') ||
                                link.label.includes('Next');

                            if (!isPrevNext && !link.active) return null;

                            return (
                                <Button
                                    key={link.label}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => {
                                        if (link.url && !isDisabled) {
                                            onPageChange?.(link.url);
                                        }
                                    }}
                                    disabled={isDisabled || !link.url}
                                >
                                    {link.label.includes('Previous') && (
                                        <ChevronLeft className="h-4 w-4" />
                                    )}
                                    {link.label.includes('Next') && (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                    {!link.label.includes('Previous') &&
                                        !link.label.includes('Next') &&
                                        link.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export type { Table } from '@tanstack/react-table';
export { useReactTable };
