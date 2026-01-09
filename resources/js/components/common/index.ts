/**
 * Central export file for all common components, utilities, and interfaces
 */

// Core UI Components
export { DataTableActions } from './DataTableActions';
export { DataTableColumnHeader } from './DataTableColumnHeader';
export { DataTableExport } from './DataTableExport';
export { DeleteDialog } from './DeleteDialog';
export { DetailRow } from './DetailRow';
export { EmptyActionState } from './EmptyActionState';
export { EmptyState } from './EmptyState';
export { FormActions } from './FormActions';
export { FormField } from './FormField';
export { InfoCard } from './InfoCard';
export { InputField } from './InputField';
export { PageHeader } from './PageHeader';
export { SelectField } from './SelectField';
export { StatusBadge } from './StatusBadge';
export { TabsNavigation } from './TabsNavigation';

// Layout Components
export { MainPageLayout, useDeleteDialog } from './layout/MainPageLayout';
export type { MainPageLayoutProps } from './layout/MainPageLayout';

// Data Table Components
export { CommonDataTable } from './data-table/CommonDataTable';
export { DataTable } from './data-table/DataTable';

// Action Components
export { ActionButton } from './actions/ActionButton';
export { BulkActionToolbar } from './actions/BulkActionToolbar';
export { Pagination } from './actions/Pagination';
export type { PaginationLink } from './actions/Pagination';

// Feedback Components
export { ConfirmDialog } from './feedback/ConfirmDialog';

// Guards
export { LoadingState } from './LoadingState';
export { PermissionGuard } from './PermissionGuard';

// CRM-Specific Components
export { InventoryBadge } from './InventoryBadge';
export { OrderStatusBadge } from './OrderStatusBadge';
export { OrderSummaryCard } from './OrderSummaryCard';
export { PaymentStatusBadge } from './PaymentStatusBadge';
export { PriceDisplay } from './PriceDisplay';

// Utility Functions
export {
    formatDateForDisplay,
    formatDateForInput,
    formatDateTimeForDisplay,
    formatTimeForDisplay,
    getRelativeTime,
    isPast,
    isToday,
} from './utils/dateUtils';

export {
    formatCurrency,
    formatErrorMessage,
    formatFileSize,
    formatNumber,
    formatPercentage,
    formatPhoneNumber,
    getInitials,
    kebabToTitle,
    sentenceCase,
    snakeToTitle,
    titleCase,
    truncate,
} from './utils/formatUtils';

export {
    arrayToPaginatedData,
    average,
    chunk,
    groupBy,
    sortBy,
    sumBy,
    unique,
    uniqueBy,
} from './utils/arrayUtils';

// Interfaces
export type {
    Address,
    Contact,
    Document,
    Note,
    PaginatedData,
} from './interfaces';
