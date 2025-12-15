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
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/src/lib/api/products/manage/get-products.manage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDeleteProduct } from "@/src/lib/api/products/manage/delete-product.manage";
import { toast } from "sonner";
import { usePagination } from "@/src/hooks/use-pagination";
import { useGetUser } from "@/src/lib/api/auth/me";
import { Skeleton } from "@/src/components/ui/skeleton";
import { getColumns } from "./columns";

export interface ProductDetailActionsProps {
  productId: string;
  page: number;
  limit: number;
}

export default function ProductList() {
  const { page, limit, next, prev } = usePagination();
  const { data: products, isLoading: loadProducts } = useGetProductsManage(
    page,
    limit
  );
  const { data: user, isLoading: loadUser } = useGetUser();

  const productsData = products?.data ?? [];
  const meta = products?.meta;

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
    <div className="w-full">
      <h1 className="mb-3 flex items-center gap-2">
        Hello,{" "}
        {loadUser ? (
          <div className="h-6 w-28">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          user?.fullname
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

export function ProductActions({
  productId,
  page,
  limit,
}: ProductDetailActionsProps) {
  const router = useRouter();

  const [openMenu, setOpenMenu] = React.useState(false);

  const copyProductId = (id: string) => {
    navigator.clipboard.writeText(productId.toString());
    toast.success("Product ID copied to clipboard.");
  };

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
          onClick={() => copyProductId(productId)}
        >
          Copy Product ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`/products/manage/${productId}`)}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`/products/manage/edit/${productId}`)}
        >
          Edit
        </DropdownMenuItem>

        <ProductDeletion productId={productId} page={page} limit={limit} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProductDeletion({
  productId,
  page,
  limit,
}: {
  productId: string;
  page: number;
  limit: number;
}) {
  const [open, setOpen] = React.useState(false);

  const { mutate: deleteProduct, isPending } = useDeleteProduct({
    page,
    limit,
    mutationConfig: {
      onSuccess: () => {
        toast.success("Product deleted.");
        setOpen(false);
      },
    },
  });

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem
          data-no-close
          onSelect={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setTimeout(() => setOpen(true), 0);
          }}
          className="cursor-pointer text-red-600"
        >
          Delete
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete product?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to remove this
            product?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={() => handleDeleteProduct(productId)}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
