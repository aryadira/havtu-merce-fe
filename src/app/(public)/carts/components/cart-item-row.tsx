"use client";

import { Button } from "@/src/components/ui/button";
import { useRemoveCartItem } from "@/src/lib/api/carts/remove-cart.item";
import { useUpdateCartItem } from "@/src/lib/api/carts/update-cart.item";
import { CartItem } from "@/src/types/product";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { mutate: updateCartItem } = useUpdateCartItem({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Cart updated successfully");
      },
    },
  });

  const { mutate: removeCartItem } = useRemoveCartItem({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Cart removed successfully");
      },
    },
  });

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      <div className="h-24 w-24 overflow-hidden rounded-md border border-border bg-muted">
        {item.product.image_url && (
          <img
            src={item.product.image_url}
            alt={item.product.name}
            className="size-24 object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="grid gap-1">
          <div className="flex justify-between">
            <Link
              href={`/products/${item.product.id}`}
              className="font-medium hover:underline line-clamp-1"
            >
              {item.product.name}
            </Link>
            <p className="font-semibold ml-4">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format((item.product.price || 0) * item.item_qty)}
            </p>
          </div>
          {item.product.user && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              Seller: {item.product.user.fullname}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                updateCartItem({
                  item_id: item.item_id,
                  item_qty: item.item_qty - 1,
                })
              }
              disabled={item.item_qty <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.item_qty}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                updateCartItem({
                  item_id: item.item_id,
                  item_qty: item.item_qty + 1,
                })
              }
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeCartItem(item.item_id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
