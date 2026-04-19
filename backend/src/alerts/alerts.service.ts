import { Injectable } from '@nestjs/common';
import { getAlarmTypeId, ALARM_TYPES } from '../config/alarms.config';
import { getTerIdByVehicle, VEHICLES } from '../config/vehicles.config';
import { PdfService } from './pdf.service';
import { MailService } from './mail.service';

const MASSTRANS_API_BASE = 'http://52.66.177.17:12056/api/v1/basic/alarm';
const MASSTRANS_API_KEY =
  'ytU2t%2FveJMrA3lyyuFfttL6rf1DUBjRPZjkeTSTNX3mg0DrdI9PhUJFysOUzfMJjwtSvS7K7y8c1sO0%3D';

// The alarm types to always include in the detail request
const DETAIL_ALARM_TYPES = Object.keys(ALARM_TYPES).map(Number);

@Injectable()
export class AlertsService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly mailService: MailService,
  ) {}
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

  /**
   * Fetches counts for ALL alarm types for a given vehicle or ALL vehicles.
   * Useful for the Dashboard Health Board.
   */
  async getBulkAlarmCounts(
    vehicleNumber: string,
    date: string,
  ): Promise<Array<{ typeId: number; name: string; count: number }>> {
    let terids: string[];

    if (vehicleNumber === 'All' || !vehicleNumber) {
      terids = Object.keys(VEHICLES);
    } else {
      const terid = getTerIdByVehicle(vehicleNumber);
      if (!terid) throw new Error(`No terid found for vehicle: ${vehicleNumber}`);
      terids = [terid];
    }

    const starttime = `${date} 00:00:00`;
    const endtime = `${date} 23:59:59`;

    // Fetch counts for all defined alarm types in parallel
    const typeIds = Object.keys(ALARM_TYPES).map(Number);
    
    const countPromises = typeIds.map(async (typeId) => {
      try {
        const body = {
          key: MASSTRANS_API_KEY,
          terid: terids,
          type: typeId,
          starttime,
          endtime,
        };

        const response = await fetch(`${MASSTRANS_API_BASE}/count`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) return { typeId, name: ALARM_TYPES[typeId], count: 0 };

        const json = await response.json();
        const count = json?.data?.[0]?.count ?? 0;
        return { typeId, name: ALARM_TYPES[typeId], count };
      } catch (err) {
        console.error(`Failed to fetch count for type ${typeId}:`, err);
        return { typeId, name: ALARM_TYPES[typeId], count: 0 };
      }
    });

    return Promise.all(countPromises);
  }

  /**
   * Fetches alerts, generates a PDF, and sends it to specified emails.
   */
  async sendAlertsEmail(
    vehicleNumber: string,
    date: string,
    emails: string[],
  ): Promise<any> {
    // 1. Get alert records
    const data = await this.getAlarmDetails(vehicleNumber, date);
    if (!data.alerts || data.alerts.length === 0) {
      throw new Error('No alerts found for the selected vehicle and date.');
    }

    // 2. Generate PDF
    const pdfBuffer = await this.pdfService.generateAlertsPdf(
      vehicleNumber,
      date,
      data.alerts,
    );

    // 3. Send Email
    const subject = `Alert Report: ${vehicleNumber} (${date})`;
    const text = `Please find the below report\n\nTotal Alerts: ${data.totalAlerts}`;
    
    const attachments = [
      {
        filename: `Alerts_${vehicleNumber}_${date}.pdf`,
        content: pdfBuffer,
      },
    ];

    return this.mailService.sendMailWithAttachment(
      emails,
      subject,
      text,
      attachments,
    );
  }
}
