import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Authentication is temporarily disabled per user request
  // if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin-login.php')) {
  //   const adminToken = request.cookies.get('admin_token');
  //   
  //   if (!adminToken || adminToken.value !== 'authenticated') {
  //     return NextResponse.redirect(new URL('/admin-login.php', request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
