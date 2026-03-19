import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Button } from '@/src/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { AppPage } from '@/src/types/app-page';
import { AppPageActions } from './app-page-actions'; 
import { formatDate } from '@/src/lib/utils';

export const getAppPageColumns = (): ColumnDef<AppPage>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting()}>
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium px-4">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'path',
        header: () => <div>Path (URL)</div>,
        cell: ({ row }) => <div className="font-mono text-sm">{row.getValue('path')}</div>,
    },
    {
        accessorKey: 'description',
        header: () => <div>Description</div>,
        cell: ({ row }) => <div>{row.getValue('description') || '-'}</div>,
    },
    {
        accessorKey: 'created_at',
        header: () => <div className="text-right">Created Date</div>,
        cell: ({ row }) => {
            const createdAt = row.getValue('created_at') as string;
            return (
                <div className="text-right">
                    {formatDate(createdAt)}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => (
            <AppPageActions
                page={row.original}
            />
        ),
    },
];
