import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Allow access to static assets and API routes
  if (
    pathname.startsWith('/_next/') || // Next.js assets
    pathname.startsWith('/static/') || // Static files
    pathname.startsWith('/public/') || // Public files
    pathname.startsWith('/api/') // API routes
  ) {
    return NextResponse.next();
  }

  // If not logged in, allow access only to /, /sign-in, and /sign-up
  if (!token) {
    if (pathname === '/sign-in' || pathname === '/sign-up') {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  // If logged in, prevent access to /sign-in and /sign-up
  if (token && (pathname === '/sign-in' || pathname === '/sign-up')) {
    if (token.role === 'Mahasiswa') {
      return NextResponse.redirect(new URL('/', req.url));
    } else if (token.role === 'Admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    } else if (token.role === 'Tutor') {
      return NextResponse.redirect(new URL('/tutor', req.url));
    }
  }

  // Role based
  if (token) {
    if (token.role === 'Mahasiswa' && (pathname === '/admin' || pathname === '/tutor')) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    if (token.role === 'Tutor' && (pathname === '/admin' || pathname === '/')) {
        return NextResponse.redirect(new URL('/tutor', req.url));
    }
    if (token.role === 'Admin' && (pathname === '/' || pathname === '/tutor')) {
        return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  // If logged in, allow access to any other path
  return NextResponse.next();
}

// Apply middleware to all paths except static assets and API routes
export const config = {
  matcher: '/((?!^/_next/|^/static/|^/public/|^/api/).*)',
};
