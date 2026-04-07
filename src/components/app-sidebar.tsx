'use client';

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
} from '@/src/components/ui/sidebar';
import { SIDEBAR_NAVIGATIONS } from '../lib/constants/sidebar-navigation';
import { usePathname, useRouter } from 'next/navigation';
import { useLogout, useMe, useSwitchToBuyer } from '../lib/hooks/auth';
import { ArrowLeft, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';
import { Skeleton } from './ui/skeleton';

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: user, isLoading: loadUser } = useMe();

    const { mutate: logout, isPending } = useLogout({
        onSuccess: () => {
            toast.success('Logout berhasil!');
        },
        onError: () => {
            toast.error('Gagal logout, coba lagi.');
        },
    });

    const { mutate: switchToBuyer, isPending: isSwitchingToBuyer } = useSwitchToBuyer({
        onSuccess: () => {
            toast.success('Kembali ke mode Buyer!');
            router.push('/products/shop');
        },
        onError: (err: any) => {
            toast.error('Gagal berpindah mode.');
        },
    });

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout(undefined);
    };

    const isPendingAction = isPending || isSwitchingToBuyer;

    const userRoleSlugs = (user?.user_has_roles || user?.roles || []).map((r: any) => typeof r === 'string' ? r : r.role_slug);

    const filteredNavigations = SIDEBAR_NAVIGATIONS.filter((item) => {
        if (!item.roles) return true;
        return userRoleSlugs.some((r: string) => item.roles!.includes(r));
    });

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>HavtuMerce</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {loadUser ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <SidebarMenuItem key={i}>
                                        <SidebarMenuButton disabled>
                                            <Skeleton className="w-4 h-4" />
                                            <Skeleton className="w-24 h-4" />
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            ) : (
                                filteredNavigations.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a
                                                href={item.url}
                                                className={cn(
                                                    'flex items-center gap-2',
                                                    pathname === item.url &&
                                                        'text-primary font-medium',
                                                )}
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            )}
                        </SidebarMenu>

                        <SidebarMenu className="mt-4 border-t pt-2">
                            {userRoleSlugs.includes('seller') && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <button
                                            onClick={() => switchToBuyer()}
                                            disabled={isPendingAction}
                                            className="cursor-pointer flex w-full items-center gap-2 text-emerald-600 hover:text-emerald-700 transition"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>
                                                {isSwitchingToBuyer ? 'Switching...' : 'Back to Buyer'}
                                            </span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <button
                                        onClick={handleLogout}
                                        disabled={isPendingAction}
                                        className="cursor-pointer flex w-full items-center gap-2 text-red-600 hover:text-red-700 transition"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>{isPending ? 'Logging out...' : 'Logout'}</span>
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
