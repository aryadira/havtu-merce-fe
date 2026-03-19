'use client';

import { Suspense, useState, useMemo } from 'react';
import {
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
import { ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Input } from '@/src/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/src/components/ui/table';
import { useAppPages } from '@/src/lib/hooks/app-page';
import { AppPage } from '@/src/types/app-page';
import { Skeleton } from '@/src/components/ui/skeleton';
import { getAppPageColumns } from './columns';
import { RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAppPage } from '@/src/lib/hooks/app-page';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

const formSchema = z.object({
    path: z.string().min(1, 'Path is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
});

export default function AppPages() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-96" />}>
            <AppPagesContent />
        </Suspense>
    );
}

function AppPagesContent() {
    const { data: pages, isLoading, refetch, isRefetching } = useAppPages();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    
    // Create form dialog state
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            path: '',
            name: '',
            description: '',
        },
    });

    const { mutate: createPage, isPending: isCreating } = useCreateAppPage({
        onSuccess: () => {
            toast.success('App page created successfully');
            setIsCreateOpen(false);
            form.reset();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to create app page');
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createPage(values);
    };

    const columns = useMemo(() => getAppPageColumns(), []);

    const table = useReactTable<AppPage>({
        data: pages ?? [],
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
            <h1 className="text-2xl font-bold mb-4">App Pages Management</h1>
            <p className="text-gray-500 mb-6">Master data for application pages, used to configure role-based access.</p>

            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Filter pages by path..."
                    value={(table.getColumn('path')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('path')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => refetch()} 
                    disabled={isRefetching}
                    title="Refresh Data"
                >
                    <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
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

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Page</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New App Page</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="path"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Path (URL Endpoint)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="/dashboard" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Page Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Dashboard" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Main dashboard for admin" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isCreating}>
                                        {isCreating ? 'Saving...' : 'Save Page'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-hidden border rounded-md">
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <div className="flex flex-col gap-2 w-full">
                                        {Array.from({ length: 5 }).map((_, i) => (
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
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
