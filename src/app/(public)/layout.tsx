import { AppHeader } from "@/src/components/app-header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="flex flex-col items-center">{children}</main>
      <footer className="border-t border-border py-8 mt-16">
        <div className="container">
          <p className="text-center text-xs text-muted-foreground">
            © 2024 MINIMAL.SHOP — All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
