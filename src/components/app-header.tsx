"use client";

import { ShoppingCart, Package, LogOut } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { useCart } from "../context/cart-context";
import { useLogout } from "../lib/api/auth";
import { useGetCarts } from "../lib/api/carts";
import { useMe } from "../lib/api/auth";
import { Skeleton } from "./ui/skeleton";

export function AppHeader() {
  const { data: user, isLoading: loadUser } = useMe();
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
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
          >
            <Package className="h-5 w-5" />
            <span className="text-sm tracking-tight">MINSHOP</span>
          </Link>
        </div>

        <nav className="flex items-center gap-2">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Avatar>
                  <AvatarImage
                    src={user && user.profile.avatar}
                    alt="@profile"
                  />
                  <AvatarFallback>
                    {user?.profile.fullname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-start flex-col">
                  {loadUser ? (
                    <>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </>
                  ) : (
                    <>
                      <div>{user?.profile.fullname}</div>
                      <div className="text-xs text-muted-foreground">
                        {user?.email}
                      </div>
                    </>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/orders">
                  <DropdownMenuItem className="cursor-pointer">
                    Orders
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isPending}
                className="cursor-pointer"
              >
                {isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
