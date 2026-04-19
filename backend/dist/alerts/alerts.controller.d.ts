import { AlertsService } from './alerts.service';
declare class GetAlarmCountDto {
    vehicleNumber: string;
    alarmName: string;
    date: string;
}
declare class GetAlarmDetailDto {
    vehicleNumber: string;
    date: string;
}
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    getVehicles(): {
        terid: string;
        vehicleNumber: string;
    }[];
    getAlarmTypes(): {
        typeId: number;
        name: string;
    }[];
    getAlarmCount(dto: GetAlarmCountDto): Promise<{
        count: number;
        terid: string;
        date: string;
        alarmName: string;
    }>;
    getAlarmDetails(dto: GetAlarmDetailDto): Promise<{
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
}
export {};
