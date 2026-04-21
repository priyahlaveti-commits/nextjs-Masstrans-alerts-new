import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const { mobile, otp, deviceId } = await request.json();
    if (!mobile || typeof mobile !== 'string') {
      return NextResponse.json({ error: 'mobile is required' }, { status: 400 });
    }
    if (!otp || isNaN(Number(otp))) {
      return NextResponse.json({ error: 'otp must be a number' }, { status: 400 });
    }
    const result = await AuthService.verifyOtp(
      mobile.trim(),
      Number(otp),
      deviceId || 'web',
    );
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to verify OTP' }, { status: 502 });
  }
}
