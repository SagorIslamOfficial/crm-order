import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { RoleEditForm } from '@/components/modules/role';
import type { EditRolePageProps } from '@/components/modules/role/types';
import { dashboard } from '@/routes';
import { index as rolesIndex, show as rolesShow } from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs = (roleName: string): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Roles',
        href: rolesIndex().url,
    },
    {
        title: roleName,
        href: '#',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

export default function EditRole({ role, permissions }: EditRolePageProps) {
    return (
        <MainPageLayout
            title={`Edit ${role.name}`}
            description="Update role information and permissions"
            breadcrumbs={breadcrumbs(role.name)}
            backButton={{
                href: rolesShow(role.id).url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <div className="mx-auto max-w-2xl">
                <RoleEditForm role={role} permissions={permissions} />
            </div>
        </MainPageLayout>
    );
}
