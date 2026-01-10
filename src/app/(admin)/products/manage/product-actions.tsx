"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
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
} from "@/src/components/ui/dialog";
import { useDeleteProduct } from "@/src/lib/api/products";

export interface ProductDetailActionsProps {
  productId: string;
  page: number;
  limit: number;
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
