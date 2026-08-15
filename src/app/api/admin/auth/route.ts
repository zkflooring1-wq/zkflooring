import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Default password 'zkadmin2026' if not set in env
    const adminPassword = process.env.ADMIN_PASSWORD || 'zkadmin2026';

    if (password === adminPassword) {
      // Setup secure HttpOnly cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
