import {
    CommonDataTable,
    ConfirmDialog,
    DataTableExport,
} from '@/components/common';
import {
    MainPageLayout,
    useDeleteDialog,
} from '@/components/common/layout/MainPageLayout';
import { UseUserColumns } from '@/components/modules/user';
import type { User, UserIndexProps } from '@/components/modules/user/types';
import { useInertiaProps } from '@/hooks';
import {
    create as usersCreate,
    destroy as usersDestroy,
    index as usersIndex,
} from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { type Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: usersIndex().url,
    },
];

export default function UserIndex() {
    const { users } = useInertiaProps<UserIndexProps>();
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [table, setTable] = React.useState<Table<User> | null>(null);

    const deleteDialog = useDeleteDialog<User>({
        getItemName: (user) => user.name,
        onDelete: (user) => {
            router.delete(usersDestroy(user.id).url);
        },
    });

    const columns = UseUserColumns({
        onDelete: (user) => deleteDialog.show(user),
    });

    const exportColumns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'roles', label: 'Roles' },
        { key: 'email_verified_at', label: 'Email Verified' },
        { key: 'created_at', label: 'Created' },
    ];

    return (
        <MainPageLayout
            title="Users"
            description="Manage system users and their roles"
            breadcrumbs={breadcrumbs}
            useCard={false}
            search={{
                value: globalFilter,
                placeholder: 'Search by name or email...',
                onSearch: (value) => {
                    setGlobalFilter(value);
                    router.get(
                        usersIndex().url,
                        { search: value },
                        { preserveState: true, preserveScroll: true },
                    );
                },
            }}
            createButton={{
                label: 'Add User',
                href: usersCreate().url,
                icon: Plus,
                permission: 'users.create',
            }}
            columnsButton={
                table && (
                    <DataTableExport
                        table={table}
                        filename="users"
                        columns={exportColumns}
                    />
                )
            }
        >
            <div className="space-y-4">
                <CommonDataTable
                    columns={columns}
                    data={users}
                    globalFilterValue={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    onTableChange={setTable}
                />
            </div>

            <ConfirmDialog
                {...deleteDialog.dialogProps}
                title="Delete User"
                description={`Are you sure you want to delete user "${deleteDialog.itemName}"? This action cannot be undone.`}
            />
        </MainPageLayout>
    );
}
