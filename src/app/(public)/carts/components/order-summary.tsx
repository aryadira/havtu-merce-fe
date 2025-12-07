"use client";

import { useCart } from "@/src/context/cart-context";
import { Separator } from "@/src/components/ui/separator";

interface OrderSummaryProps {
  showDetails?: boolean;
}

export function OrderSummary({ showDetails = false }: OrderSummaryProps) {
  const { subtotal, shipping, total } = useCart();

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {shipping === 0
              ? "Free"
              : new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(shipping)}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
