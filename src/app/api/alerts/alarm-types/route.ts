import { NextRequest, NextResponse } from 'next/server';
import { getAlarmTypeList } from '@/lib/config/alarms';

export async function GET(request: NextRequest) {
  try {
    const alarmTypes = getAlarmTypeList();
    return NextResponse.json(alarmTypes);
  } catch (error: any) {
    console.error('Error fetching alarm types:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch alarm types' },
      { status: 500 }
    );
  }
}
