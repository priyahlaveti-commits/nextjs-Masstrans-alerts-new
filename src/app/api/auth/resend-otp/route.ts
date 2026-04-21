import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();
    if (!mobile || typeof mobile !== 'string') {
      return NextResponse.json({ error: 'mobile is required' }, { status: 400 });
    }
    const result = await AuthService.resendOtp(mobile.trim());
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to resend OTP' }, { status: 502 });
  }
}
