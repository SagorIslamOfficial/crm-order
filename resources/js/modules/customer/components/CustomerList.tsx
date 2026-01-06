import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    edit as customersEdit,
    show as customersShow,
} from '@/routes/customers';
import { formatDate, formatPhone } from '@/shared/utils';
import { Link } from '@inertiajs/react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import type { Customer } from '../types';

interface CustomerListProps {
    customers: Customer[];
    loading?: boolean;
    onDelete?: (customer: Customer) => void;
}

export function CustomerList({
    customers,
    loading,
    onDelete,
}: CustomerListProps) {
    if (loading) {
        return (
            <div className="flex h-32 items-center justify-center">
                <div className="text-muted-foreground">
                    Loading customers...
                </div>
            </div>
        );
    }

    if (customers.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center">
                <div className="text-muted-foreground">No customers found</div>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers.map((customer) => (
                    <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                            {customer.name}
                        </TableCell>
                        <TableCell>{formatPhone(customer.phone)}</TableCell>
                        <TableCell>{customer.address || '-'}</TableCell>
                        <TableCell>{formatDate(customer.created_at)}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Link href={customersShow(customer.id).url}>
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href={customersEdit(customer.id).url}>
                                    <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                {onDelete && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(customer)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
