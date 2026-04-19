export declare const ALARM_TYPES: Record<number, string>;
export declare function getAlarmTypeList(): {
    typeId: number;
    name: string;
}[];
export declare function getAlarmTypeId(name: string): number | undefined;
