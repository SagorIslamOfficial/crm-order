import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { UserEditForm } from '@/components/modules/user';
import type { EditUserPageProps } from '@/components/modules/user/types';
import { dashboard } from '@/routes';
import { index as usersIndex, show as usersShow } from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-react';

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
    {
        title: 'Edit',
        href: '#',
    },
];

export default function EditUser({ user, roles }: EditUserPageProps) {
    return (
        <MainPageLayout
            title={`Edit ${user.name}`}
            description="Update user information and roles"
            breadcrumbs={breadcrumbs(user.name)}
            backButton={{
                href: usersShow(user.id).url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <div className="mx-auto max-w-2xl">
                <UserEditForm user={user} roles={roles} />
            </div>
        </MainPageLayout>
    );
}
