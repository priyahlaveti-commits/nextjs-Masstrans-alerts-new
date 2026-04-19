// Maps terid (device ID) to vehicle registration number
export const VEHICLES: Record<string, string> = {
  "00C4002F1F": "AP39WF8584",
};

// Returns list of { terid, vehicleNumber } for dropdowns
export function getVehicleList() {
  return Object.entries(VEHICLES).map(([terid, vehicleNumber]) => ({
    terid,
    vehicleNumber,
  }));
}

// Returns terid for a given vehicle number
export function getTerIdByVehicle(vehicleNumber: string): string | undefined {
  return Object.entries(VEHICLES).find(([, v]) => v === vehicleNumber)?.[0];
}
