"use client";

import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/context/cart-context";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartItemRow } from "./components/cart-item-row";
import { OrderSummary } from "./components/order-summary";
import { useGetCarts } from "@/src/lib/api/carts/get-carts";
import { Skeleton } from "@/src/components/ui/skeleton";

const Cart = () => {
  const router = useRouter();
  const { data: carts, isLoading: loadCarts } = useGetCarts();

  const cartItems = carts?.cart_items;
  const cartItemsCount = cartItems?.length || 0;
  const cartEmptyCondition = cartItems?.length == 0;

  // Loading state cart
  if (loadCarts) {
    return <CartLoading />;
  }

  // Empty state cart
  if (cartEmptyCondition) {
    return <CartEmpty />;
  }

  // Normal state cart
  return (
    <div className="container py-8">
      <h1 className="text-xl font-bold text-foreground mb-8 slide-up">
        Shopping Cart ({cartItemsCount})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4">
            {cartItems?.map((item) => (
              <div key={item.item_id}>
                <CartItemRow item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary showDetails={true} />
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

const CartLoading = () => {
  return (
    <div className="container py-8">
      <Skeleton className="h-8 w-48 mb-8" />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items Column */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            {/* Simulate 3 cart items */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 py-4 border-b border-border last:border-0"
              >
                {/* Image Skeleton */}
                <Skeleton className="h-24 w-24 rounded-md shrink-0" />

                <div className="flex flex-1 flex-col justify-between">
                  {/* Title & Price */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-4 w-1/4" />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-6 space-y-4 sticky top-24">
            <Skeleton className="h-6 w-1/3 mb-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>

            <Skeleton className="h-10 w-full mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CartEmpty = () => {
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
};

export default Cart;
