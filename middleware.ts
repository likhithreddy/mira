import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

// User-protected page routes
const USER_PROTECTED_ROUTES = ['/dashboard', '/setup', '/session', '/profile'];
const USER_PROTECTED_PREFIXES = ['/reports'];

// Admin routes
const ADMIN_PREFIX = '/admin';

// Auth routes (redirect if logged in)
const AUTH_ROUTES = ['/login', '/signup'];

// User API routes
const USER_API_ROUTES = [
  '/api/generate-questions',
  '/api/generate-followup',
  '/api/generate-report',
  '/api/summarize-context',
  '/api/judge',
];
const USER_API_PREFIXES = ['/api/resumes'];

// Admin API routes
const ADMIN_API_PREFIX = '/api/admin';

/**
 * Check if the path is a user-protected page route
 */
function isUserProtectedRoute(pathname: string): boolean {
  return (
    USER_PROTECTED_ROUTES.includes(pathname) ||
    USER_PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

/**
 * Check if the path is an admin page route
 */
function isAdminRoute(pathname: string): boolean {
  return (
    (pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + '/')) &&
    !pathname.startsWith(ADMIN_API_PREFIX)
  );
}

/**
 * Check if the path is an auth route (login/signup)
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname);
}

/**
 * Check if the path is a user API route
 */
function isUserApiRoute(pathname: string): boolean {
  return (
    USER_API_ROUTES.some((route) => pathname.startsWith(route)) ||
    USER_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

/**
 * Check if the path is an admin API route
 */
function isAdminApiRoute(pathname: string): boolean {
  return pathname.startsWith(ADMIN_API_PREFIX);
}

/**
 * Check if the path is any protected route (page or API)
 */
function isProtectedRoute(pathname: string): boolean {
  return (
    isUserProtectedRoute(pathname) ||
    isAdminRoute(pathname) ||
    isUserApiRoute(pathname) ||
    isAdminApiRoute(pathname)
  );
}

/**
 * Next.js Edge Middleware
 *
 * Handles:
 * - Session refresh on every request
 * - Route protection for authenticated users
 * - Admin role enforcement
 * - Suspended user blocking
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session, user, and profile data
  const { response, user, profile } = await createMiddlewareClient(request);

  const isAuthenticated = !!user;
  const isAdmin = profile?.role === 'admin';
  const isSuspended = profile?.is_suspended === true;

  // 1. Handle suspended users first (if authenticated and trying to access protected routes)
  if (isAuthenticated && isSuspended && isProtectedRoute(pathname)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('suspended', 'true');
    return NextResponse.redirect(loginUrl);
  }

  // 2. Handle auth routes (/login, /signup) - redirect to dashboard if logged in
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // 3. Handle admin API routes
  if (isAdminApiRoute(pathname)) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return response;
  }

  // 4. Handle admin page routes
  if (isAdminRoute(pathname)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return response;
  }

  // 5. Handle user API routes
  if (isUserApiRoute(pathname)) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return response;
  }

  // 6. Handle user-protected page routes
  if (isUserProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // 7. Pass through for non-protected routes
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Image files (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
