import {
    CommonDataTable,
    ConfirmDialog,
    DataTableExport,
} from '@/components/common';
import {
    MainPageLayout,
    useDeleteDialog,
} from '@/components/common/layout/MainPageLayout';
import { UseRoleColumns } from '@/components/modules/role';
import type { Role, RoleIndexProps } from '@/components/modules/role/types';
import { useInertiaProps } from '@/hooks';
import {
    create as rolesCreate,
    destroy as rolesDestroy,
    index as rolesIndex,
} from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { type Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: rolesIndex().url,
    },
];

export default function RoleIndex() {
    const { roles } = useInertiaProps<RoleIndexProps>();
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [table, setTable] = React.useState<Table<Role> | null>(null);

    const deleteDialog = useDeleteDialog<Role>({
        getItemName: (role) => role.name,
        onDelete: (role) => {
            router.delete(rolesDestroy(role.id).url);
        },
    });

    const columns = UseRoleColumns({
        onDelete: (role) => deleteDialog.show(role),
    });

    const exportColumns = [
        { key: 'name', label: 'Role Name' },
        { key: 'guard_name', label: 'Guard' },
        { key: 'permissions', label: 'Permissions Count' },
        { key: 'users_count', label: 'Users' },
        { key: 'created_at', label: 'Created' },
    ];

    return (
        <MainPageLayout
            title="Roles"
            description="Manage system roles and their permissions"
            breadcrumbs={breadcrumbs}
            useCard={false}
            search={{
                value: globalFilter,
                placeholder: 'Search roles...',
                onSearch: (value) => {
                    setGlobalFilter(value);
                    router.get(
                        rolesIndex().url,
                        { search: value },
                        { preserveState: true, preserveScroll: true },
                    );
                },
            }}
            createButton={{
                label: 'Add Role',
                href: rolesCreate().url,
                icon: Plus,
                permission: 'roles.create',
            }}
            columnsButton={
                table && (
                    <DataTableExport
                        table={table}
                        filename="roles"
                        columns={exportColumns}
                    />
                )
            }
        >
            <div className="space-y-4">
                <CommonDataTable
                    columns={columns}
                    data={roles}
                    globalFilterValue={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    onTableChange={setTable}
                />
            </div>

            <ConfirmDialog
                {...deleteDialog.dialogProps}
                title="Delete Role"
                description={`Are you sure you want to delete role "${deleteDialog.itemName}"? This action cannot be undone.`}
            />
        </MainPageLayout>
    );
}
