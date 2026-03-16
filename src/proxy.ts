import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Public routes (exact match)
const PUBLIC_PATHS = new Set(['/login', '/register', '/unauthorized']);

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const next = NextResponse.next();
    const token = req.cookies.get('token')?.value;

    const loginUrl = new URL('/login', req.url);
    const unauthorizedUrl = new URL('/unauthorized', req.url);

    // allow homepage as public
    const isPublicRoute = pathname === '/' || PUBLIC_PATHS.has(pathname);
    const isAutoRedirectRoute = pathname === '/' || pathname === '/login' || pathname === '/register';

    // 1. Public route → skip auth
    if (isPublicRoute) {
        if (token && isAutoRedirectRoute) {
            const decoded: any = jwt.decode(token);
            const allowedPaths: string[] = decoded?.allowedPaths || [];

            if (allowedPaths.length > 0) {
                return NextResponse.redirect(new URL(allowedPaths[0], req.url));
            }
        }
        return next;
    }

    // 2. Non-public but no token → redirect
    if (!token) {
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Decode token (safely)
    const decoded: any = jwt.decode(token);
    const role = decoded?.role;
    const allowedPaths: string[] = decoded?.allowedPaths || [];

    // If decode fails → force login
    if (!role) {
        return NextResponse.redirect(loginUrl);
    }

    // Check role access (default deny if not in allowedPaths)
    const hasAccess = allowedPaths.some((p) => {
        // [DEBUG LOG] Aktifkan ini untuk debugging di terminal
        // console.log(`[Proxy] Checking ${pathname} against pattern: ${p}`);

        // 1. Exact Match
        if (pathname === p || pathname === p + '/') return true;

        // 2. Wildcard Support (e.g., "/products/*")
        if (p.includes('*')) {
            const wildcardPattern = p.replace(/\*/g, '.*');
            const regString = `^${wildcardPattern}(/.*)?$`;
            if (new RegExp(regString).test(pathname)) return true;
        }

        // 3. Parameter Support (e.g., "/products/:id", "/orders/:uuid")
        if (p.includes(':')) {
            const paramPattern = p
                .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape regex special chars (: tidak termasuk, jadi tetap aman)
                .replace(/:[^/]+/g, '[^/]+');             // Ubah :id → cocok dengan segmen apa pun
            const regString = `^${paramPattern}(/.*)?$`;
            if (new RegExp(regString).test(pathname)) return true;
        }

        // 4. Prefix Match (default behavior)
        if (pathname.startsWith(p.endsWith('/') ? p : p + '/')) return true;

        return false;
    });

    if (!hasAccess) {
        // [DEBUG LOG] Sangat berguna jika akses ditolak terus
        console.log(`[Proxy] !! ACCESS DENIED !! Path: ${pathname} | Role: ${role} | Allowed: ${JSON.stringify(allowedPaths)}`);
        return NextResponse.rewrite(unauthorizedUrl);
    }

    return next;
}

// Avoid running on assets & API
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)'],
};
