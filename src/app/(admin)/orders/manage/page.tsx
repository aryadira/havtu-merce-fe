'use client';

import { Suspense, useState } from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/src/components/ui/table';
import { usePagination } from '@/src/hooks/use-pagination';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useManageOrders } from '@/src/lib/hooks/order';
import { OrderResponse } from '@/src/types/order';

interface OrderDetailActionsProps {
    orderId: string;
}

export const dynamic = 'force-dynamic';

// Main component with logic
function OrderListContent() {
    const { page, limit, next, prev } = usePagination();
    const { data: orders, isLoading: loadOrders } = useManageOrders({ page, limit });

    const ordersData = orders?.data ?? [];
    const meta = orders?.meta ?? { totalItems: 0, itemCount: 0 };

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable<OrderResponse>({
        data: ordersData ?? [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <h1 className="text-2xl">Manage Orders</h1>
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Filter by Order ID..."
                    value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('id')?.setFilterValue(event.target.value)}
                    className="max-w-sm cursor-pointer"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden  border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loadOrders ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex flex-col gap-2 w-full">
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <Skeleton key={i} className="w-full h-10" />
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {page} of {meta.itemCount} / {meta.totalItems} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => prev(meta)}
                        disabled={page <= 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => next(meta)}
                        disabled={meta.itemCount < limit}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Export a wrapper that includes Suspense
export default function OrderList() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-96" />}>
            <OrderListContent />
        </Suspense>
    );
}

const columns: ColumnDef<OrderResponse>[] = [
    {
        accessorKey: 'order_number',
        header: 'Order #',
        cell: ({ row }) => <div className="text-xs font-bold">{row.getValue('order_number')}</div>,
    },
    {
        accessorKey: 'user_id',
        header: 'User ID',
        cell: ({ row }) => (
            <div className="text-[10px] text-muted-foreground truncate max-w-[80px]" title={row.getValue('user_id')}>
                {row.getValue('user_id')}
            </div>
        ),
    },
    {
        accessorKey: 'order_total',
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = Number(row.getValue('order_total'));
            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(amount);
            return <div className="text-right font-bold text-emerald-600">{formatted}</div>;
        },
    },
    {
        accessorKey: 'order_status_id',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.order_status;
            const statusId = row.original.order_status_id;
            return (
                <div className="font-medium text-[10px] uppercase tracking-wider bg-gray-100 px-2 py-1 rounded w-fit">
                    {status?.label || statusId.split('-')[0]}
                </div>
            );
        },
    },
    {
        accessorKey: 'payment_status_id',
        header: 'Payment',
        cell: ({ row }) => {
            const status = row.original.payment_status;
            const statusId = row.original.payment_status_id;
            const slug = status?.slug || (statusId.includes('46b3e972') ? 'unpaid' : ''); // Fallback based on provided example ID if needed, but better to just show label if exists

            return (
                <div
                    className={`text-[10px] font-bold uppercase ${
                        slug === 'paid'
                            ? 'text-green-600'
                            : slug === 'unpaid'
                              ? 'text-red-500'
                              : 'text-gray-500'
                    }`}
                >
                    {status?.label || (slug === 'unpaid' ? 'UNPAID' : statusId.split('-')[0])}
                </div>
            );
        },
    },
    {
        accessorKey: 'shipping_address',
        header: 'Shipping Address',
        cell: ({ row }) => {
            const addressStr = row.getValue('shipping_address') as string;
            try {
                const addr = JSON.parse(addressStr);
                return (
                    <div className="text-[10px] leading-tight max-w-[150px] truncate" title={`${addr.street}, ${addr.city}`}>
                        {addr.street}, {addr.city}
                    </div>
                );
            } catch (e) {
                return <div className="text-[10px] truncate max-w-[150px]">{addressStr}</div>;
            }
        },
    },
    {
        accessorKey: 'created_at',
        header: () => <div className="text-right">Ordered At</div>,
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            return (
                <div className="text-right text-xs">
                    {date.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => <OrderActions orderId={row.original.id} />,
    },
];

function OrderActions({ orderId }: OrderDetailActionsProps) {
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                        // TODO: Navigate to detail page for seller/admin
                        // router.push(`/orders/manage/${orderId}`)
                        toast.info('Detail page for seller not implemented yet.');
                    }}
                >
                    View Details
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
