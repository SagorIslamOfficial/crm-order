import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard, exportToCSV, exportToJSON } from './utils/exportData';

interface ExportColumn {
    key: string;
    label: string;
}

interface DataTableExportProps<TData> {
    table: Table<TData>;
    filename?: string;
    columns: ExportColumn[];
}

export function DataTableExport<TData>({
    table,
    filename = 'export',
    columns,
}: DataTableExportProps<TData>) {
    const handleExport = async (format: 'csv' | 'json' | 'clipboard') => {
        const rows = table
            .getFilteredRowModel()
            .rows.map((row) => row.original);

        if (rows.length === 0) {
            toast.error('No data to export');
            return;
        }

        try {
            switch (format) {
                case 'csv':
                    exportToCSV(rows, columns, `${filename}.csv`);
                    toast.success('Exported to CSV successfully');
                    break;
                case 'json':
                    exportToJSON(rows, columns, `${filename}.json`);
                    toast.success('Exported to JSON successfully');
                    break;
                case 'clipboard':
                    await copyToClipboard(rows, columns);
                    toast.success('Copied to clipboard');
                    break;
            }
        } catch (error) {
            toast.error(`Failed to export: ${error}`);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                    Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                    Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('clipboard')}>
                    Copy to clipboard
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
