import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { UserShow } from '@/components/modules/user';
import type { ShowUserPageProps } from '@/components/modules/user/types';
import { dashboard } from '@/routes';
import { edit as usersEdit, index as usersIndex } from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit } from 'lucide-react';

const breadcrumbs = (userName: string): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Users',
        href: usersIndex().url,
    },
    {
        title: userName,
        href: '#',
    },
];

export default function ShowUser({ user, available_roles }: ShowUserPageProps) {
    return (
        <MainPageLayout
            title={user.name}
            description="User details and information"
            breadcrumbs={breadcrumbs(user.name)}
            backButton={{
                href: usersIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            editButton={{
                href: usersEdit(user.id).url,
                icon: Edit,
                label: 'Edit',
                permission: 'users.edit',
            }}
            useCard={false}
        >
            <div className="space-y-6">
                <UserShow user={user} availableRoles={available_roles} />
            </div>
        </MainPageLayout>
    );
}
