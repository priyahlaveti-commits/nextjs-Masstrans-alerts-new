export declare class AlertsService {
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
}
