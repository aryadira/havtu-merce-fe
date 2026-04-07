import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { SidebarProvider, SidebarTrigger } from '@/src/components/ui/sidebar';
import { AppSidebar } from '@/src/components/app-sidebar';
import { AppHeader } from '@/src/components/app-header';
import UnauthorizedContent from './unauthorized-content';

export default async function UnauthorizedPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    let isSidebarLayout = false;

    if (token) {
        try {
            const decoded: any = jwt.decode(token);
            const roles: string[] = decoded?.roles || [];
            isSidebarLayout = roles.includes('administrator') || roles.includes('seller');
        } catch (e) {
            console.error('Failed to decode token in unauthorized page', e);
        }
    }

    if (isSidebarLayout) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full">
                    <SidebarTrigger />
                    <UnauthorizedContent />
                </main>
            </SidebarProvider>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AppHeader />
            <main className="flex-1 flex flex-col items-center">
                <UnauthorizedContent />
            </main>
            <footer className="border-t border-border py-8 mt-16">
                <div className="container mx-auto">
                    <p className="text-center text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Havtumerce — All rights reserved
                    </p>
                </div>
            </footer>
        </div>
    );
}
