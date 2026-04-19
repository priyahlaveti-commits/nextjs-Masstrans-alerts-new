import { Injectable } from '@nestjs/common';
import { getAlarmTypeId, ALARM_TYPES } from '../config/alarms.config';
import { getTerIdByVehicle, VEHICLES } from '../config/vehicles.config';

const MASSTRANS_API_BASE = 'http://52.66.177.17:12056/api/v1/basic/alarm';
const MASSTRANS_API_KEY =
  'ytU2t%2FveJMrA3lyyuFfttL6rf1DUBjRPZjkeTSTNX3mg0DrdI9PhUJFysOUzfMJjwtSvS7K7y8c1sO0%3D';

// The alarm types to always include in the detail request
const DETAIL_ALARM_TYPES = Object.keys(ALARM_TYPES).map(Number);

@Injectable()
export class AlertsService {
  /**
   * Fetches alarm count from the Masstrans external API.
   * @param vehicleNumber  - e.g. "AP39WF8584"
   * @param alarmName      - e.g. "High-speed alarm"
   * @param date           - e.g. "2026-04-18" (YYYY-MM-DD)
   */
  async getAlarmCount(
    vehicleNumber: string,
    alarmName: string,
    date: string,
  ): Promise<{ count: number; terid: string; date: string; alarmName: string }> {
    // Resolve terid from vehicle number
    const terid = getTerIdByVehicle(vehicleNumber);
    if (!terid) {
      throw new Error(`No terid found for vehicle: ${vehicleNumber}`);
    }

    // Resolve alarm type id from alarm name
    const alarmTypeId = getAlarmTypeId(alarmName);
    if (!alarmTypeId) {
      throw new Error(`No alarm type ID found for alarm: ${alarmName}`);
    }

    const starttime = `${date} 00:00:00`;
    const endtime = `${date} 23:59:59`;

    const body = {
      key: MASSTRANS_API_KEY,
      terid: [terid],
      type: alarmTypeId,
      starttime,
      endtime,
    };

    const response = await fetch(`${MASSTRANS_API_BASE}/count`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Masstrans API error: ${response.status}`);
    }

    const json = await response.json();

    // API returns data array; if empty, count is 0
    const record = json?.data?.[0];
    const count = record?.count ?? 0;

    return { count, terid, date, alarmName };
  }

  /**
   * Fetches detailed alarm records from the Masstrans external API
   * for a given vehicle and date. Includes all configured alarm types.
   * @param vehicleNumber  - e.g. "AP39WF8584"
   * @param date           - e.g. "2026-04-18" (YYYY-MM-DD)
   */
  async getAlarmDetails(
    vehicleNumber: string,
    date: string,
  ): Promise<{
    vehicleNumber: string;
    date: string;
    totalAlerts: number;
    alerts: Array<{
      sNo: number;
      time: string;
      alertType: string;
      alertTypeId: number;
      speed: number;
      latitude: string;
      longitude: string;
      direction: number;
      description: string;
    }>;
  }> {
    // Resolve terid from vehicle number
    const terid = getTerIdByVehicle(vehicleNumber);
    if (!terid) {
      throw new Error(`No terid found for vehicle: ${vehicleNumber}`);
    }

    const starttime = `${date} 00:00:00`;
    const endtime = `${date} 23:00:00`;

    const body = {
      key: MASSTRANS_API_KEY,
      terid: [terid],
      type: DETAIL_ALARM_TYPES,
      starttime,
      endtime,
    };

    const response = await fetch(`${MASSTRANS_API_BASE}/detail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Masstrans API error: ${response.status}`);
    }

    const json = await response.json();

    if (json.errorcode !== 200 || !Array.isArray(json.data)) {
      return { vehicleNumber, date, totalAlerts: 0, alerts: [] };
    }

    // Map raw API response to clean, relevant fields
    const alerts = json.data.map((item: any, index: number) => ({
      sNo: index + 1,
      time: item.gpstime || item.time || '',
      alertType: ALARM_TYPES[item.type] || `Unknown (${item.type})`,
      alertTypeId: item.type,
      speed: item.speed ?? 0,
      latitude: item.gpslat || '',
      longitude: item.gpslng || '',
      direction: item.direction ?? 0,
      description: item.content || '',
    }));

    return {
      vehicleNumber,
      date,
      totalAlerts: alerts.length,
      alerts,
    };
  }
}
