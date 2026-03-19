'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <main className="w-full py-2 px-5">
            <div className="pt-2 pb-5">{children}</div>
        </main>
    );
}
