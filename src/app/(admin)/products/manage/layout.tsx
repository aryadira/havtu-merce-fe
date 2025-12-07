"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="w-full py-2 px-5">
      {!pathname.includes("/products/manage") && (
        <div className="w-fit py-1 px-2 border hover:bg-gray-1 hover:scale-105 active:scale-95 border-gray-300 text-sm rounded-md cursor-pointer">
          <Link href="/products/manage">&larr; Back</Link>
        </div>
      )}
      <div className="pt-2 pb-5">{children}</div>
    </main>
  );
}
