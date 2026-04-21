import { NextRequest, NextResponse } from 'next/server';
import { MasstransService } from '@/lib/services/masstrans.service';
import { validateAlarmCountRequest } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleNumber, alarmName, date } = validateAlarmCountRequest(body);

    const result = await MasstransService.getAlarmCount(vehicleNumber, alarmName, date);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching alarm count:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch alarm count' },
      { status: 400 }
    );
  }
}
