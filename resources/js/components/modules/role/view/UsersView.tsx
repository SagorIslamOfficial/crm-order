import { EmptyState } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Users as UsersIcon } from 'lucide-react';
import type { User } from '../types';

interface UsersViewProps {
    users: User[];
}

export function UsersView({ users }: UsersViewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    Assigned Users ({users.length})
                </CardTitle>
                <CardDescription>
                    Users who have been assigned this role
                </CardDescription>
            </CardHeader>
            <CardContent>
                {users.length > 0 ? (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                                <Link href={`/users/${user.id}`}>
                                    <Button variant="outline" size="sm">
                                        View User
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={UsersIcon}
                        title="No Users Assigned"
                        description="No users have been assigned this role yet"
                    />
                )}
            </CardContent>
        </Card>
    );
}
