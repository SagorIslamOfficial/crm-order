/**
 * Export utilities for DataTable
 */

interface ExportColumn {
    key: string;
    label: string;
}

/**
 * Export data to CSV format
 */
export function exportToCSV<T extends Record<string, unknown>>(
    data: T[],
    columns: ExportColumn[],
    filename: string = 'export.csv',
): void {
    if (data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Create CSV header
    const headers = columns.map((col) => col.label).join(',');

    // Create CSV rows
    const rows = data.map((row) => {
        return columns
            .map((col) => {
                const value = getNestedValue(row, col.key);
                // Escape commas and quotes
                const stringValue = String(value ?? '');
                if (stringValue.includes(',') || stringValue.includes('"')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            })
            .join(',');
    });

    // Combine headers and rows
    const csv = [headers, ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
}

/**
 * Export data to JSON format
 */
export function exportToJSON<T extends Record<string, unknown>>(
    data: T[],
    columns: ExportColumn[],
    filename: string = 'export.json',
): void {
    if (data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Filter data to only include specified columns
    const filteredData = data.map((row) => {
        const filtered: Record<string, unknown> = {};
        columns.forEach((col) => {
            filtered[col.label] = getNestedValue(row, col.key);
        });
        return filtered;
    });

    const json = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    downloadBlob(blob, filename);
}

/**
 * Copy data to clipboard
 */
export async function copyToClipboard<T extends Record<string, unknown>>(
    data: T[],
    columns: ExportColumn[],
): Promise<void> {
    if (data.length === 0) {
        console.warn('No data to copy');
        return;
    }

    // Create tab-separated values
    const headers = columns.map((col) => col.label).join('\t');
    const rows = data.map((row) => {
        return columns
            .map((col) => String(getNestedValue(row, col.key) ?? ''))
            .join('\t');
    });

    const tsv = [headers, ...rows].join('\n');

    try {
        await navigator.clipboard.writeText(tsv);
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        throw err;
    }
}

/**
 * Helper function to get nested object values
 */
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Helper function to download blob
 */
function downloadBlob(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
