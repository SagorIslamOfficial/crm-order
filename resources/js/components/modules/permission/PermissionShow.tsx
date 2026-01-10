import { TabsNavigation } from '@/components/common';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import { OverviewView, RolesView, UsersView } from './view';

import type { Permission, Role, User } from './types';

interface PermissionShowProps {
    permission: Permission;
    roles: Role[];
    users: User[];
    className?: string;
}

export function PermissionShow({
    permission,
    roles,
    users,
    className = '',
}: PermissionShowProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { value: 'overview', label: 'Overview' },
        { value: 'roles', label: `Roles (${roles.length})` },
        { value: 'users', label: `Users (${users.length})` },
    ];

    return (
        <div className={className}>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
            >
                <TabsNavigation tabs={tabs} />

                <TabsContent value="overview" className="space-y-4">
                    <OverviewView permission={permission} />
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                    <RolesView roles={roles} />
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <UsersView users={users} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
