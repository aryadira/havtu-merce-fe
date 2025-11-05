import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// 🔓 Route publik (tidak perlu login)
const PUBLIC_PATHS = ["/", "/login", "/register", "/about", "/contact"];

// 🔐 Route berbasis role
const ROLE_ACCESS: { [key: string]: string[] } = {
  user: ["/products/shop", "/cart", "/orders"],
  seller: ["/products/manage", "/orders/seller"],
  admin: ["/products/access", "/dashboard/admin"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const next = NextResponse.next();
  const token = req.cookies.get("token")?.value;

  // Urls
  const loginUrl = new URL("/login", req.url);
  const unauthorizedUrl = new URL("/unauthorized", req.url);

  // 🟢 1. Cek apakah route termasuk PUBLIC_PATHS
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (isPublic) {
    // Kalau route publik, lewati semua pemeriksaan
    return next;
  }

  // 🔴 2. Kalau tidak publik tapi tidak ada token → redirect login
  if (!token) {
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🔒 3. Kalau ada token, cek role dan akses
  try {
    const decoded: any = jwt.decode(token);
    const role = decoded?.role;

    console.log("Decoded JWT:", decoded); // 🔍 lihat isi token kamu

    // Jika route tidak termasuk roleAccess mana pun → izinkan
    const allAllowedPaths = Object.values(ROLE_ACCESS).flat();
    const isProtectedRoute = allAllowedPaths.some((path) =>
      pathname.startsWith(path)
    );

    // Kalau bukan protected route, semua role boleh akses
    if (!isProtectedRoute) return next;

    // Kalau route protected, cek apakah role punya akses
    const allowedPaths = ROLE_ACCESS[role] || [];
    const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));

    if (!isAllowed) {
      return NextResponse.redirect(unauthorizedUrl);
    }

    return next;
  } catch (error) {
    console.error("JWT decode error:", error);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
