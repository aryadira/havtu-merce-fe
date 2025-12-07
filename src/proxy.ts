import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Public routes (exact match)
const PUBLIC_PATHS = new Set(["/login", "/register", "/unauthorized"]);

// Role-based routes
const ROLE_ACCESS: Record<string, string[]> = {
  user: ["/products/shop", "/cart"],
  seller: ["/products/manage", "/orders"],
  admin: ["/products/access", "/dashboard/admin"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const next = NextResponse.next();
  const token = req.cookies.get("token")?.value;

  const loginUrl = new URL("/login", req.url);
  const unauthorizedUrl = new URL("/unauthorized", req.url);

  // allow homepage as public
  const isPublicRoute = pathname === "/" || PUBLIC_PATHS.has(pathname);

  // 1. Public route → skip auth
  if (isPublicRoute) {
    if (token) {
      const decoded: any = jwt.decode(token);
      const role = decoded?.role;
      
      if (role && ROLE_ACCESS[role]) {
        return NextResponse.redirect(new URL(ROLE_ACCESS[role][0], req.url));
      }
    }
    return next;
  }

  // 2. Non-public but no token → redirect
  if (!token) {
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode token (safely)
  const decoded: any = jwt.decode(token);
  const role = decoded?.role;

  // If decode fails → force login
  if (!role) {
    return NextResponse.redirect(loginUrl);
  }

  // Protected route check
  const allProtectedPaths = Object.values(ROLE_ACCESS).flat();
  const isProtectedRoute = allProtectedPaths.some((p) =>
    pathname.startsWith(p)
  );

  // If not protected → allow
  if (!isProtectedRoute) return next;

  // Check role access
  const allowedPaths = ROLE_ACCESS[role] || [];
  const hasAccess = allowedPaths.some((p) => pathname.startsWith(p));

  if (!hasAccess) {
    return NextResponse.redirect(unauthorizedUrl);
  }

  return next;
}

// Avoid running on assets & API
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)"],
};
