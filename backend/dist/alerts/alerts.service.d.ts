import { PdfService } from './pdf.service';
import { MailService } from './mail.service';
export declare class AlertsService {
    private readonly pdfService;
    private readonly mailService;
    constructor(pdfService: PdfService, mailService: MailService);
    getAlarmCount(vehicleNumber: string, alarmName: string, date: string): Promise<{
        count: number;
        terid: string;
        date: string;
        alarmName: string;
    }>;
    getAlarmDetails(vehicleNumber: string, date: string): Promise<{
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
    }>;
    getBulkAlarmCounts(vehicleNumber: string, date: string): Promise<Array<{
        typeId: number;
        name: string;
        count: number;
    }>>;
    sendAlertsEmail(vehicleNumber: string, date: string, emails: string[]): Promise<any>;
}
