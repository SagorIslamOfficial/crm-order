import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { RoleCreateForm } from '@/components/modules/role';
import type { CreateRolePageProps } from '@/components/modules/role/types';
import { dashboard } from '@/routes';
import { index as rolesIndex } from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Roles',
        href: rolesIndex().url,
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function CreateRole({ permissions }: CreateRolePageProps) {
    return (
        <MainPageLayout
            title="Create Role"
            description="Add a new role to the system"
            breadcrumbs={breadcrumbs}
            backButton={{
                href: rolesIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <div className="mx-auto max-w-2xl">
                <RoleCreateForm permissions={permissions} />
            </div>
        </MainPageLayout>
    );
}
