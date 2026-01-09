import { EmptyState } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { Shield, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { Role } from '../types';

interface RolesViewProps {
    userId: string;
    assignedRoles: string[];
    availableRoles: Role[];
}

export function RolesView({
    userId,
    assignedRoles,
    availableRoles,
}: RolesViewProps) {
    const [roles, setRoles] = useState<string[]>(assignedRoles);
    const [isLoading, setIsLoading] = useState(false);

    const handleAssignRole = (roleName: string) => {
        setIsLoading(true);
        router.post(
            `/users/${userId}/roles/${roleName}`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRoles([...roles, roleName]);
                },
                onError: (errors) => {
                    console.error('Error assigning role:', errors);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    const handleRemoveRole = (roleName: string) => {
        setIsLoading(true);
        router.delete(`/users/${userId}/roles/${roleName}`, {
            preserveScroll: true,
            onSuccess: () => {
                setRoles(roles.filter((r) => r !== roleName));
            },
            onError: (errors) => {
                console.error('Error removing role:', errors);
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    const unassignedRoles = availableRoles.filter(
        (role) => !roles.includes(role.name),
    );

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Assigned Roles */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        Assigned Roles ({roles.length})
                    </CardTitle>
                    <CardDescription>
                        Currently active roles for this user
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {roles.length > 0 ? (
                        <div className="space-y-3">
                            {roles.map((roleName) => {
                                const roleInfo = availableRoles.find(
                                    (r) => r.name === roleName,
                                );
                                return (
                                    <div
                                        key={roleName}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {roleInfo?.label || roleName}
                                            </p>
                                            {roleInfo?.permissions_count !==
                                                undefined && (
                                                <p className="text-sm text-muted-foreground">
                                                    {roleInfo.permissions_count}{' '}
                                                    permission
                                                    {roleInfo.permissions_count !==
                                                    1
                                                        ? 's'
                                                        : ''}
                                                </p>
                                            )}
                                        </div>
                                        {roleName !== 'Administrator' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleRemoveRole(roleName)
                                                }
                                                disabled={isLoading}
                                                className="gap-1 text-destructive hover:text-destructive"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState
                            icon={ShieldCheck}
                            title="No Roles Assigned"
                            description="This user has no roles assigned yet"
                        />
                    )}
                </CardContent>
            </Card>

            {/* Available Roles */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Available Roles ({unassignedRoles.length})
                    </CardTitle>
                    <CardDescription>
                        Roles that can be assigned to this user
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!roles.includes('Administrator') ? (
                        unassignedRoles.length > 0 ? (
                            <div className="grid max-h-96 gap-3 overflow-y-auto">
                                {unassignedRoles.map((role) => (
                                    <div
                                        key={role.name}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {role.label}
                                            </p>
                                            {role.permissions_count !==
                                                undefined && (
                                                <p className="text-sm text-muted-foreground">
                                                    {role.permissions_count}{' '}
                                                    permission
                                                    {role.permissions_count !==
                                                    1
                                                        ? 's'
                                                        : ''}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleAssignRole(role.name)
                                            }
                                            disabled={isLoading}
                                            className="gap-1"
                                        >
                                            <ShieldCheck className="h-3 w-3" />
                                            Assign
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Shield}
                                title="All Roles Assigned"
                                description="All available roles are already assigned to this user"
                            />
                        )
                    ) : (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Administrator Role:</strong> This user
                                has the Administrator role and cannot be
                                assigned additional roles.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
