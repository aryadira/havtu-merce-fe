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
import { useMe } from '@/src/lib/hooks/auth';
import { OrderResponse } from '@/src/types/order';
import { formatPrice } from '@/src/lib/utils';
import { PageLoader } from '@/src/components/ui/page-loader';
import { getOrderColumns } from './columns';



export const dynamic = 'force-dynamic';

export default function OrderList() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-96" />}>
            <OrderListContent />
        </Suspense>
    );
}

function OrderListContent() {
    const { page, limit, next, prev } = usePagination();
    const { data: orders, isLoading: loadOrders } = useManageOrders({ page, limit });
    const { data: user, isLoading: loadUser } = useMe();

    const ordersData = orders?.data ?? [];
    const meta = orders?.meta;

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable<OrderResponse>({
        data: ordersData ?? [],
        columns: getOrderColumns({ page, limit }),
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
            <h1 className="mb-3 flex items-center gap-2">
                Hello,{' '}
                {loadUser ? (
                    <div className="h-6 w-28">
                        <Skeleton className="w-full h-full" />
                    </div>
                ) : (
                    user?.profile.fullname
                )}
            </h1>

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
                                <TableCell
                                    colSpan={getOrderColumns({ page, limit }).length}
                                    className="h-24 text-center"
                                >
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
                                <TableCell
                                    colSpan={getOrderColumns({ page, limit }).length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1">
                    Page {meta?.currentPage} of {meta?.totalPages} — showing {meta?.itemCount} items
                    out of {meta?.totalItems}.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => prev(meta)}
                        disabled={!meta?.hasPreviousPage}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => next(meta)}
                        disabled={!meta?.hasNextPage}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

