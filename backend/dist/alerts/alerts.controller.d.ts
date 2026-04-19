import { AlertsService } from './alerts.service';
declare class GetAlarmCountDto {
    vehicleNumber: string;
    alarmName: string;
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
}
export {};
