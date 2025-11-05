"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { SIDEBAR_NAVIGATIONS } from "../lib/constants/sidebar-navigation";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useLogout } from "../lib/api/auth/logout";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>HavtuMerce</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_NAVIGATIONS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={cn(
                        "flex items-center gap-2",
                        pathname === item.url && "text-primary font-medium"
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <SidebarMenu className="mt-4 border-t pt-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="flex w-full items-center gap-2 text-red-600 hover:text-red-700 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isPending ? "Logging out..." : "Logout"}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* Optional: bisa tambahkan footer info, versi app, dll */}
      </SidebarFooter>
    </Sidebar>
  );
}
