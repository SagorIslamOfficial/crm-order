import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { RoleShow } from '@/components/modules/role';
import type { ShowRolePageProps } from '@/components/modules/role/types';
import { dashboard } from '@/routes';
import { edit as rolesEdit, index as rolesIndex } from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit } from 'lucide-react';

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
];

export default function ShowRole({ role }: ShowRolePageProps) {
    return (
        <MainPageLayout
            title={role.name}
            description="Role details and assigned users"
            breadcrumbs={breadcrumbs(role.name)}
            backButton={{
                href: rolesIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            editButton={{
                href: rolesEdit(role.id).url,
                icon: Edit,
                label: 'Edit',
                permission: 'roles.edit',
            }}
            useCard={false}
        >
            <div className="space-y-6">
                <RoleShow role={role} />
            </div>
        </MainPageLayout>
    );
}
