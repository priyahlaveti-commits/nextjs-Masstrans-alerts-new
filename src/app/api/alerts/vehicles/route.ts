import { NextRequest, NextResponse } from 'next/server';
import { getVehicleList } from '@/lib/config/vehicles';

export async function GET(request: NextRequest) {
  try {
    const vehicles = getVehicleList();
    return NextResponse.json(vehicles);
  } catch (error: any) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}
