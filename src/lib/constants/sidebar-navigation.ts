import { Calendar, Home, Inbox, LogOut, Search, Settings, ShoppingBag } from "lucide-react";

export const SIDEBAR_NAVIGATIONS = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Manage Products",
    url: "/products/manage",
    icon: Inbox,
  },
  {
    title: "Manage Orders",
    url: "/orders/manage",
    icon: ShoppingBag,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];
