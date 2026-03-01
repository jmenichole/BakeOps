import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const PUBLIC_ROUTES = new Set([
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/pricing',
  '/support',
  '/terms',
  '/privacy',
  '/refund',
  '/trial-expired',
  '/auth/callback',
]);

// API routes that don't require user auth (cron jobs, public endpoints)
const PUBLIC_API_ROUTES = new Set([
  '/api/traction-report', // protected by CRON_SECRET instead
  '/api/track-referral',  // public referral click tracking
]);

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Skip auth check for public routes
  if (PUBLIC_ROUTES.has(pathname)) {
    return res;
  }

  // Skip auth check for public API routes
  if (PUBLIC_API_ROUTES.has(pathname)) {
    return res;
  }

  // Skip auth check for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return res;
  }

  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Admin IP Allowlist Check
  if (pathname.startsWith('/admin')) {
    const allowedIps = (process.env.ALLOWED_ADMIN_IP || '').split(',').map(ip => ip.trim()).filter(Boolean);
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      req.ip;

    // If allowlist is set, check if client IP is in it
    if (allowedIps.length > 0) {
      if (!clientIp || !allowedIps.includes(clientIp)) {
        console.warn(`Blocked unauthorized admin access attempt from IP: ${clientIp || 'Unknown'}`);
        return new NextResponse(
          JSON.stringify({ error: 'Access Denied: IP not allowed' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // Redirect unauthenticated users to login
  if (!session) {
    // For API routes, return 401 instead of redirect
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*',
  ],
};
