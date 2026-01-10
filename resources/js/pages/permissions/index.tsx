import {
    CommonDataTable,
    ConfirmDialog,
    DataTableExport,
} from '@/components/common';
import {
    MainPageLayout,
    useDeleteDialog,
} from '@/components/common/layout/MainPageLayout';
import { UsePermissionColumns } from '@/components/modules/permission';
import type {
    Permission,
    PermissionIndexProps,
} from '@/components/modules/permission/types';
import { useInertiaProps } from '@/hooks';
import {
    create as permissionsCreate,
    destroy as permissionsDestroy,
    index as permissionsIndex,
} from '@/routes/permissions';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { type Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import * as React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: permissionsIndex().url,
    },
];

export default function PermissionIndex() {
    const { permissions, search } = useInertiaProps<PermissionIndexProps>();
    const [globalFilter, setGlobalFilter] = React.useState(search || '');
    const [table, setTable] = React.useState<Table<Permission> | null>(null);

    const deleteDialog = useDeleteDialog<Permission>({
        getItemName: (permission) => permission.name,
        onDelete: (permission) => {
            router.delete(permissionsDestroy(permission.id).url);
        },
    });

    const columns = UsePermissionColumns({
        onDelete: (permission) => deleteDialog.show(permission),
    });

    const exportColumns = [
        { key: 'name', label: 'Permission Name' },
        { key: 'guard_name', label: 'Guard' },
        { key: 'roles_count', label: 'Roles' },
        { key: 'users_count', label: 'Users' },
        { key: 'created_at', label: 'Created' },
    ];

    return (
        <MainPageLayout
            title="Permissions"
            description="Manage system permissions and their assignments"
            breadcrumbs={breadcrumbs}
            useCard={false}
            search={{
                value: globalFilter,
                placeholder: 'Search permissions...',
                onSearch: (value) => {
                    setGlobalFilter(value);
                    router.get(
                        permissionsIndex().url,
                        { search: value },
                        { preserveState: true, preserveScroll: true },
                    );
                },
            }}
            createButton={{
                label: 'New Permission',
                href: permissionsCreate().url,
                icon: Plus,
                permission: 'permissions.create',
            }}
            columnsButton={
                table && (
                    <DataTableExport
                        table={table}
                        filename="permissions"
                        columns={exportColumns}
                    />
                )
            }
        >
            <div className="space-y-4">
                <CommonDataTable
                    columns={columns}
                    data={permissions}
                    globalFilterValue={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    onTableChange={setTable}
                />
            </div>

            <ConfirmDialog
                {...deleteDialog.dialogProps}
                title="Delete Permission"
                description={`Are you sure you want to delete permission "${deleteDialog.itemName}"? This action cannot be undone.`}
            />
        </MainPageLayout>
    );
}
