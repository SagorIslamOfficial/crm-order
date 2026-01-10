import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { PermissionCreateForm } from '@/components/modules/permission';
import { dashboard } from '@/routes';
import { index as permissionsIndex } from '@/routes/permissions';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Permissions',
        href: permissionsIndex().url,
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function CreatePermission() {
    return (
        <MainPageLayout
            title="Create Permission"
            description="Add a new permission to the system"
            breadcrumbs={breadcrumbs}
            backButton={{
                href: permissionsIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <div className="mx-auto max-w-2xl">
                <PermissionCreateForm />
            </div>
        </MainPageLayout>
    );
}
