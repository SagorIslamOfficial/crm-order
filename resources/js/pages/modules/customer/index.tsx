import {
    CommonDataTable,
    ConfirmDialog,
    DataTableExport,
} from '@/components/common';
import {
    MainPageLayout,
    useDeleteDialog,
} from '@/components/common/layout/MainPageLayout';
import { UseCustomerColumns } from '@/components/modules/customer';
import type {
    Customer,
    CustomerIndexProps,
} from '@/components/modules/customer/types';
import { useInertiaProps } from '@/hooks';
import {
    create as customersCreate,
    destroy as customersDestroy,
    index as customersIndex,
} from '@/routes/customers';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { type Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: customersIndex().url,
    },
];

export default function CustomerIndex() {
    const { customers } = useInertiaProps<CustomerIndexProps>();
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [table, setTable] = React.useState<Table<Customer> | null>(null);

    const deleteDialog = useDeleteDialog<Customer>({
        getItemName: (customer) => customer.name,
        onDelete: (customer) => {
            router.delete(customersDestroy(customer.id).url);
        },
    });

    const columns = UseCustomerColumns({
        onDelete: (customer) => deleteDialog.show(customer),
    });

    const exportColumns = [
        { key: 'name', label: 'Customer Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'address', label: 'Address' },
        { key: 'created_at', label: 'Member Since' },
    ];

    return (
        <MainPageLayout
            title="Customers"
            description="Manage your customers"
            breadcrumbs={breadcrumbs}
            useCard={false}
            search={{
                value: globalFilter,
                placeholder: 'Search by name or phone...',
                onSearch: (value) => {
                    setGlobalFilter(value);
                    router.get(
                        customersIndex().url,
                        { search: value },
                        { preserveState: true, preserveScroll: true },
                    );
                },
            }}
            createButton={{
                label: 'New Customer',
                href: customersCreate().url,
                icon: Plus,
                permission: 'customers.create',
            }}
            columnsButton={
                table && (
                    <DataTableExport
                        table={table}
                        filename="customers"
                        columns={exportColumns}
                    />
                )
            }
        >
            <div className="space-y-4">
                <CommonDataTable
                    columns={columns}
                    data={customers}
                    globalFilterValue={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    onTableChange={setTable}
                />
            </div>

            <ConfirmDialog
                {...deleteDialog.dialogProps}
                title="Delete Customer"
                description={`Are you sure you want to delete customer "${deleteDialog.itemName}"? This action cannot be undone.`}
            />
        </MainPageLayout>
    );
}
