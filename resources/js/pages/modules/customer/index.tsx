import { Button } from '@/components/ui/button';
import type { Customer, CustomerIndexProps } from '@/modules/customer/types';
import {
    create as customersCreate,
    destroy as customersDestroy,
    edit as customersEdit,
    index as customersIndex,
    show as customersShow,
} from '@/routes/customers';
import {
    ActionButton,
    ConfirmDialog,
    DataTable,
    MainPageLayout,
    useDeleteDialog,
} from '@/shared/components';
import { useInertiaProps } from '@/shared/hooks/UseInertiaProps';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, Plus, Trash2 } from 'lucide-react';
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

    const deleteDialog = useDeleteDialog<Customer>({
        getItemName: (customer) => customer.name,
        onDelete: (customer) => {
            router.delete(customersDestroy(customer.id).url, {
                onSuccess: () => {},
            });
        },
    });

    const columns: ColumnDef<Customer>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="-ml-3"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue('name')}</span>
            ),
        },
        {
            accessorKey: 'phone',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="-ml-3"
                >
                    Phone
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-mono">{row.getValue('phone')}</span>
            ),
        },
        {
            accessorKey: 'address',
            header: 'Address',
            cell: ({ row }) => {
                const address = row.getValue('address');
                return (
                    <span className="text-muted-foreground">
                        {address ? String(address) : '-'}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const customer = row.original;
                return (
                    <div className="flex justify-end gap-2">
                        <ActionButton
                            icon={Eye}
                            href={customersShow(customer.id).url}
                            title="View customer"
                        />
                        <ActionButton
                            icon={Edit}
                            href={customersEdit(customer.id).url}
                            title="Edit customer"
                        />
                        <ActionButton
                            icon={Trash2}
                            onClick={() => deleteDialog.show(customer)}
                            title="Delete customer"
                        />
                    </div>
                );
            },
        },
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
        >
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={customers.data}
                    globalFilterValue={globalFilter}
                    pagination={{
                        current_page: customers.current_page,
                        last_page: customers.last_page,
                        total: customers.total,
                        per_page: customers.per_page,
                        links: customers.links,
                    }}
                    onPageChange={(url) => router.visit(url)}
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
