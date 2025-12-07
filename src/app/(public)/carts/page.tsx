"use client";

import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/context/cart-context";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartItemRow } from "./components/cart-item-row";
import { OrderSummary } from "./components/order-summary";

const Cart = () => {
  const { items } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center slide-up">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Your cart is empty
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Looks like you haven't added anything yet
          </p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-xl font-bold text-foreground mb-8 slide-up">
        Shopping Cart ({items.length})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4">
            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary showDetails={false} />
            <Button
              className="w-full mt-4 btn-bounce"
              size="lg"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
