import { TabsNavigation } from '@/components/common';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import { OverviewView, RolesView } from './view';

import type { Role, User } from './types';

interface UserShowProps {
    user: User;
    availableRoles: Role[];
    className?: string;
}

export function UserShow({
    user,
    availableRoles,
    className = '',
}: UserShowProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { value: 'overview', label: 'Overview' },
        { value: 'roles', label: `Roles (${user.roles.length})` },
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
                    <OverviewView user={user} />
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                    <RolesView
                        userId={user.id}
                        assignedRoles={user.roles}
                        availableRoles={availableRoles}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
