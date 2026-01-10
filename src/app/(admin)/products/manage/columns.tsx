import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Button } from "@/src/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ProductItemResponse } from "@/src/lib/api/products";
import { ProductActions } from "./product-actions"; // sesuaikan dengan path

export const getColumns = (
  page: number,
  limit: number
): ColumnDef<ProductItemResponse>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Product Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    id: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const items = row.original.items;
      const price = items?.[0]?.price || 0;
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price);

      const hasMultiplePrices =
        items?.length > 1 && new Set(items.map((i) => i.price)).size > 1;

      return (
        <div className="text-right font-medium">
          {formatted}
          {hasMultiplePrices ? "+" : ""}
        </div>
      );
    },
  },
  {
    id: "stock",
    header: () => <div className="text-right">Total Stock</div>,
    cell: ({ row }) => {
      const items = row.original.items;
      const totalStock =
        items?.reduce((acc, item) => acc + item.qty_in_stock, 0) || 0;
      return <div className="text-right">{totalStock}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-right">Created Date</div>,
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      return (
        <div className="text-right">
          {new Intl.DateTimeFormat("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
            .format(new Date(createdAt))
            .replace(",", "")}
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <div
          className={`capitalize ${
            isActive ? "text-green-600" : "text-red-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => (
      <ProductActions productId={row.original.id} page={page} limit={limit} />
    ),
  },
];
