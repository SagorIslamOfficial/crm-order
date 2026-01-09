import { DetailRow, InfoCard } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface OverviewViewProps {
    role: {
        id: number;
        name: string;
        guard_name: string;
        permissions: string[];
        users_count: number;
        created_at: string;
        updated_at: string;
    };
    usersCount: number;
}

export function OverviewView({ role, usersCount }: OverviewViewProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Role Information */}
            <InfoCard
                title="Role Information"
                icon={Shield}
                description="Basic details about this role"
            >
                <div className="space-y-4">
                    <DetailRow label="Name" value={role.name} />
                    <DetailRow
                        label="Users Assigned"
                        value={`${usersCount} user${usersCount !== 1 ? 's' : ''}`}
                    />
                    <DetailRow
                        label="Created"
                        value={new Date(role.created_at).toLocaleDateString(
                            'en-US',
                            {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            },
                        )}
                    />
                    <DetailRow
                        label="Last Updated"
                        value={new Date(role.updated_at).toLocaleDateString(
                            'en-US',
                            {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            },
                        )}
                    />
                </div>
            </InfoCard>

            {/* Permissions */}
            <InfoCard
                title="Permissions"
                icon={Shield}
                description="Permissions assigned to this role"
            >
                {role.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary">
                                {permission}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No permissions assigned
                    </p>
                )}
            </InfoCard>
        </div>
    );
}
