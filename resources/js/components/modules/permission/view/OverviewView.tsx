import { DetailRow, InfoCard } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import type { Permission } from '../types';

interface OverviewViewProps {
    permission: Permission;
}

export function OverviewView({ permission }: OverviewViewProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Permission Information */}
            <InfoCard
                title="Permission Information"
                description="Basic details about this permission"
            >
                <div className="space-y-4">
                    <DetailRow label="Name" value={permission.name} />
                    <DetailRow
                        label="Guard Name"
                        value={
                            <Badge variant="outline">
                                {permission.guard_name}
                            </Badge>
                        }
                    />
                    <DetailRow
                        label="Created"
                        value={new Date(
                            permission.created_at,
                        ).toLocaleDateString()}
                    />
                    <DetailRow
                        label="Last Updated"
                        value={new Date(
                            permission.updated_at,
                        ).toLocaleDateString()}
                    />
                </div>
            </InfoCard>

            {/* Usage Statistics */}
            <InfoCard
                title="Usage Statistics"
                description="How this permission is currently used"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                            Total Assignments
                        </span>
                        <Badge variant="secondary">
                            {permission.roles_count + permission.users_count}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Via Roles</span>
                        <Badge variant="secondary" className="gap-1">
                            <Users className="h-3 w-3" />
                            {permission.roles_count}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                            Direct to Users
                        </span>
                        <Badge variant="outline" className="gap-1">
                            <Users className="h-3 w-3" />
                            {permission.users_count}
                        </Badge>
                    </div>
                </div>
            </InfoCard>
        </div>
    );
}
