import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    await AuthService.logout(token ?? undefined);
    return NextResponse.json({ status: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Logout failed' }, { status: 502 });
  }
}
