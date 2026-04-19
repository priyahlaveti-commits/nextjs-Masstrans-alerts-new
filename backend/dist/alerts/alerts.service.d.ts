export declare class AlertsService {
    getAlarmCount(vehicleNumber: string, alarmName: string, date: string): Promise<{
        count: number;
        terid: string;
        date: string;
        alarmName: string;
    }>;
}
