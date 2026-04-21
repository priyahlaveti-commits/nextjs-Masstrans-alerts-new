import { NextRequest, NextResponse } from 'next/server';
import { MasstransService } from '@/lib/services/masstrans.service';
import { validateAlarmDetailRequest } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleNumber, date } = validateAlarmDetailRequest(body);

    const result = await MasstransService.getAlarmDetails(vehicleNumber, date);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching alarm details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch alarm details' },
      { status: 400 }
    );
  }
}
