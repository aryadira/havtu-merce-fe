"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  ProductItemResponse,
  useGetProductsManage,
} from "@/src/lib/api/products";
import Link from "next/link";
import { usePagination } from "@/src/hooks/use-pagination";
import { useMe } from "@/src/lib/api/auth";
import { Skeleton } from "@/src/components/ui/skeleton";
import { getColumns } from "./columns";

export const dynamic = "force-dynamic";

function ProductListContent() {
  const { page, limit, next, prev } = usePagination();
  const { data: products, isLoading: loadProducts } = useGetProductsManage(
    page,
    limit
  );
  const { data: user, isLoading: loadUser } = useMe();

  const productsData = products?.data ?? [];
  const meta = products?.meta;

  console.log("{ProductData}", productsData);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable<ProductItemResponse>({
    data: productsData ?? [],
    columns: getColumns(page, limit),
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
    <div className="max-w-4xl">
      <h1 className="mb-3 flex items-center gap-2">
        Hello,{" "}
        {loadUser ? (
          <div className="h-6 w-28">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          user?.profile.fullname
        )}
      </h1>

      <h1 className="text-2xl">Products</h1>
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter products..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
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
        <Link href="/products/manage/create">
          <Button className="cursor-pointer">Add Product</Button>
        </Link>
      </div>
      <div className="overflow-hidden rounded-md border">
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
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loadProducts ? (
              <TableRow>
                <TableCell
                  colSpan={getColumns(page, limit).length}
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
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={getColumns(page, limit).length}
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
        <div className="text-muted-foreground flex-1 text-sm">
          Page {meta?.currentPage} of {meta?.totalPages} — showing{" "}
          {meta?.itemCount} items out of {meta?.totalItems}.
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

export default function ProductList() {
  return (
    <React.Suspense fallback={<Skeleton className="w-full h-96" />}>
      <ProductListContent />
    </React.Suspense>
  );
}
