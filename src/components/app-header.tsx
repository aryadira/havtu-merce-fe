"use client";

import { ShoppingCart, Package, LogOut } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/cart-context";
import { Button } from "./ui/button";
import { useLogout } from "../lib/api/auth/logout";
import { toast } from "sonner";
import { useGetCarts } from "../lib/api/carts/get-carts";

export function AppHeader() {
  const { data: carts, isLoading: loadCarts } = useGetCarts();
  const itemCount =
    carts?.cart_items?.reduce((total, item) => total + item.item_qty, 0) || 0;

  const { mutate: logout, isPending } = useLogout({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Logout berhasil!");
      },
      onError: () => {
        toast.error("Gagal logout, coba lagi.");
      },
    },
  });

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout(undefined);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
        >
          <Package className="h-5 w-5" />
          <span className="text-sm tracking-tight">MINIMAL.SHOP</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            Products
          </Link>
          <Link href="/carts">
            <Button variant="ghost" size="sm" className="relative btn-bounce">
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Button>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="cursor-pointer flex w-full items-center gap-2 text-red-600 hover:text-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>{isPending ? "Logging out..." : "Logout"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
