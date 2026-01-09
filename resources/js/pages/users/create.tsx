import { MainPageLayout } from '@/components/common/layout/MainPageLayout';
import { UserCreateForm } from '@/components/modules/user';
import type { CreateUserPageProps } from '@/components/modules/user/types';
import { dashboard } from '@/routes';
import { index as usersIndex } from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Users',
        href: usersIndex().url,
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function CreateUser({ roles }: CreateUserPageProps) {
    return (
        <MainPageLayout
            title="Create User"
            description="Add a new user to the system"
            breadcrumbs={breadcrumbs}
            backButton={{
                href: usersIndex().url,
                icon: ArrowLeft,
                label: 'Back',
            }}
            useCard={false}
        >
            <div className="mx-auto max-w-2xl">
                <UserCreateForm roles={roles} />
            </div>
        </MainPageLayout>
    );
}
