"use client";

import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/context/cart-context";
import { CartItem } from "@/src/types/product";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      <div className="h-24 w-24 overflow-hidden rounded-md border border-border bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          className="size-24 object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="grid gap-1">
          <div className="flex justify-between">
            <Link
              href={`/product/${product.id}`}
              className="font-medium hover:underline line-clamp-1"
            >
              {product.name}
            </Link>
            <p className="font-semibold ml-4">
              ${(product.price * quantity).toFixed(2)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{product.category}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(product.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
