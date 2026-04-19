export declare const VEHICLES: Record<string, string>;
export declare function getVehicleList(): {
    terid: string;
    vehicleNumber: string;
}[];
export declare function getTerIdByVehicle(vehicleNumber: string): string | undefined;
