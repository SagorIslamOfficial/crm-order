import { EmptyState } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import type { Role } from '../types';

interface RolesViewProps {
    roles: Role[];
}

export function RolesView({ roles }: RolesViewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Assigned Roles ({roles.length})
                </CardTitle>
                <CardDescription>
                    Roles that have been granted this permission
                </CardDescription>
            </CardHeader>
            <CardContent>
                {roles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {roles.map((role) => (
                            <Link key={role.id} href={`/roles/${role.id}`}>
                                <Badge
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-secondary/80"
                                >
                                    {role.name}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Shield}
                        title="No Roles Assigned"
                        description="No roles have been assigned this permission"
                    />
                )}
            </CardContent>
        </Card>
    );
}
