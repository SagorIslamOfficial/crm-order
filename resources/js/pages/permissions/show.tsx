import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { PermissionShow } from '@/components/modules/permission';
import type { ShowPermissionPageProps } from '@/components/modules/permission/types';
import { dashboard } from '@/routes';
import {
    edit as permissionsEdit,
    index as permissionsIndex,
} from '@/routes/permissions';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit } from 'lucide-react';

const breadcrumbs = (permissionName: string): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Permissions',
        href: permissionsIndex().url,
    },
    {
        title: permissionName,
        href: '#',
    },
];

export default function ShowPermission({
    permission,
    roles,
    users,
}: ShowPermissionPageProps) {
    return (
        <MainPageLayout
            title={permission.name}
            description="Permission details and assignments"
            breadcrumbs={breadcrumbs(permission.name)}
            backButton={{
                href: permissionsIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            editButton={{
                href: permissionsEdit(permission.id).url,
                icon: Edit,
                label: 'Edit',
                permission: 'permissions.edit',
            }}
            useCard={false}
        >
            <div className="space-y-6">
                <PermissionShow
                    permission={permission}
                    roles={roles}
                    users={users}
                />
            </div>
        </MainPageLayout>
    );
}
