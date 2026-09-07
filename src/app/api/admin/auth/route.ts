import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const HMAC_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'zk_admin_security_key_2027';
const EXPECTED_SECURITY_ANSWER = 'ZKF2027';

// Generate HMAC signature for math challenge
function signMathChallenge(num1: number, num2: number, timestamp: number): string {
  const data = `${num1}:${num2}:${timestamp}`;
  return crypto.createHmac('sha256', HMAC_SECRET).update(data).digest('hex');
}

// GET: Returns a fresh cryptographically signed single-digit math challenge (1 to 9 + 1 to 9)
export async function GET() {
  try {
    const num1 = Math.floor(Math.random() * 9) + 1; // 1 to 9 (single digit)
    const num2 = Math.floor(Math.random() * 9) + 1; // 1 to 9 (single digit)
    const timestamp = Date.now();
    const signature = signMathChallenge(num1, num2, timestamp);
    const token = Buffer.from(`${num1}:${num2}:${timestamp}:${signature}`).toString('base64');

    return NextResponse.json({
      success: true,
      question: `What is ${num1} + ${num2}?`,
      token,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to generate security challenge' });
  }
}

// POST: Multi-Factor Admin Authentication
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, securityAnswer, mathToken, mathAnswer } = body;

    // 1. Validate Math Challenge
    if (!mathToken || mathAnswer === undefined || mathAnswer === null || String(mathAnswer).trim() === '') {
      return NextResponse.json({ success: false, message: 'Please complete the math security verification challenge.' });
    }

    try {
      const decoded = Buffer.from(mathToken, 'base64').toString('utf-8');
      const [num1Str, num2Str, timestampStr, providedSignature] = decoded.split(':');
      const num1 = parseInt(num1Str, 10);
      const num2 = parseInt(num2Str, 10);
      const timestamp = parseInt(timestampStr, 10);

      // Verify expiration (valid for 10 minutes)
      if (Date.now() - timestamp > 10 * 60 * 1000) {
        return NextResponse.json({ success: false, message: 'Math challenge expired. Please refresh and try again.' });
      }

      // Verify HMAC signature
      const expectedSignature = signMathChallenge(num1, num2, timestamp);
      if (providedSignature !== expectedSignature) {
        return NextResponse.json({ success: false, message: 'Security challenge signature is invalid.' });
      }

      // Verify user arithmetic answer
      if (parseInt(String(mathAnswer).trim(), 10) !== num1 + num2) {
        return NextResponse.json({ success: false, message: 'Incorrect math calculation answer. Please try again.' });
      }
    } catch {
      return NextResponse.json({ success: false, message: 'Malformed math security challenge.' });
    }

    // 2. Validate Master Security Answer
    if (!securityAnswer || String(securityAnswer).trim().toUpperCase() !== EXPECTED_SECURITY_ANSWER) {
      return NextResponse.json({ success: false, message: 'Invalid Master Security Answer. Please check your authorization code.' });
    }

    // 3. Authenticate with Supabase Auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabasePublishableKey) {
      return NextResponse.json({ success: false, message: 'Supabase configuration is missing on server.' });
    }

    const supabase = createClient(supabaseUrl, supabasePublishableKey);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: (email || '').trim(),
      password: password || '',
    });

    if (authError || !authData.user) {
      return NextResponse.json({ 
        success: false, 
        message: authError?.message || 'Invalid email address or admin password.' 
      });
    }

    // 4. Set secure HttpOnly session cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Also store user email for dashboard reference if needed
    cookieStore.set('admin_user_email', authData.user.email || 'admin@zkflooring.com', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      message: 'Admin authorization successful.',
      redirect: 'http://localhost:3001/dashboard',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });

  } catch (error) {
    console.error('Admin Auth Error:', error);
    return NextResponse.json({ success: false, message: 'An unexpected server error occurred during authorization.' });
  }
}

// DELETE: Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('admin_token');
    cookieStore.delete('admin_user_email');
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to logout.' });
  }
}
