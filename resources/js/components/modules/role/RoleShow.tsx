import { TabsNavigation } from '@/components/common';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import { OverviewView, UsersView } from './view';

import type { User } from './types';

interface RoleShowProps {
    role: {
        id: number;
        name: string;
        guard_name: string;
        permissions: string[];
        users_count: number;
        created_at: string;
        updated_at: string;
        users: User[];
    };
    className?: string;
}

export function RoleShow({ role, className = '' }: RoleShowProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { value: 'overview', label: 'Overview' },
        { value: 'users', label: `Users (${role.users.length})` },
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
                    <OverviewView role={role} usersCount={role.users.length} />
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <UsersView users={role.users} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
