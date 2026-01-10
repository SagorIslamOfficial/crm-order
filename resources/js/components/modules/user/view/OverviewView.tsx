import { DetailRow, InfoCard } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Mail, Shield } from 'lucide-react';
import type { User } from '../types';

interface OverviewViewProps {
    user: User;
}

export function OverviewView({ user }: OverviewViewProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Contact Information */}
            <InfoCard
                title="Contact Information"
                icon={Mail}
                description="Email and contact details"
            >
                <div className="space-y-4">
                    <DetailRow label="Email Address" value={user.email} />

                    <DetailRow
                        label="Account Created"
                        value={new Date(user.created_at).toLocaleDateString(
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
                        value={new Date(user.updated_at).toLocaleDateString(
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

            {/* Roles & Permissions */}
            <InfoCard
                title="Roles & Permissions"
                icon={Shield}
                description="Assigned roles and access levels"
            >
                <div className="space-y-4">
                    <div>
                        <span className="text-sm font-medium text-muted-foreground">
                            Assigned Roles ({user.roles.length})
                        </span>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {user.roles.length > 0 ? (
                                user.roles.map((role) => (
                                    <Badge
                                        key={role}
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        <Shield className="h-3 w-3" />
                                        {role}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No roles assigned
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </InfoCard>
        </div>
    );
}
