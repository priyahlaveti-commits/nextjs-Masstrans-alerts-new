import { NextRequest, NextResponse } from 'next/server';
import { MasstransService } from '@/lib/services/masstrans.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleNumber, date } = body;

    if (!date) {
      return NextResponse.json(
        { error: 'date is required' },
        { status: 400 }
      );
    }

    const result = await MasstransService.getBulkAlarmCounts(vehicleNumber, date);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching bulk alarm counts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bulk alarm counts' },
      { status: 400 }
    );
  }
}
