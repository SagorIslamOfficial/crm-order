import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { PermissionEditForm } from '@/components/modules/permission';
import type { EditPermissionPageProps } from '@/components/modules/permission/types';
import { dashboard } from '@/routes';
import {
    index as permissionsIndex,
    show as permissionsShow,
} from '@/routes/permissions';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-react';

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
    {
        title: 'Edit',
        href: '#',
    },
];

export default function EditPermission({
    permission,
}: EditPermissionPageProps) {
    return (
        <MainPageLayout
            title={`Edit ${permission.name}`}
            description="Update permission information"
            breadcrumbs={breadcrumbs(permission.name)}
            backButton={{
                href: permissionsShow(permission.id).url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <div className="mx-auto max-w-2xl">
                <PermissionEditForm permission={permission} />
            </div>
        </MainPageLayout>
    );
}
