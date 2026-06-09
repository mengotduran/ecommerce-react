import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/checkout', '/orders'];
const ADMIN_ONLY = ['/admin'];
const GUEST_ONLY = ['/login', '/register'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read persisted auth from zustand's localStorage key (stored as cookie via the store)
  // We use a cookie approach: the frontend sets 'auth-token' cookie on login
  const token = req.cookies.get('auth-token')?.value;
  const role  = req.cookies.get('auth-role')?.value;

  const isAuthed = !!token;

  // Redirect logged-in users away from login/register
  if (GUEST_ONLY.some((p) => pathname.startsWith(p)) && isAuthed) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Protect routes that require login
  if (PROTECTED.some((p) => pathname.startsWith(p)) && !isAuthed) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Admin-only routes
  if (ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
    if (!isAuthed) return NextResponse.redirect(new URL('/login', req.url));
    if (role !== 'ADMIN' && role !== 'SUPERADMIN') return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
