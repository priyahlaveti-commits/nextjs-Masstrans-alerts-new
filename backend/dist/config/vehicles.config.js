"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VEHICLES = void 0;
exports.getVehicleList = getVehicleList;
exports.getTerIdByVehicle = getTerIdByVehicle;
exports.VEHICLES = {
    "00C4002F1F": "AP39WF8584",
};
function getVehicleList() {
    return Object.entries(exports.VEHICLES).map(([terid, vehicleNumber]) => ({
        terid,
        vehicleNumber,
    }));
}
function getTerIdByVehicle(vehicleNumber) {
    return Object.entries(exports.VEHICLES).find(([, v]) => v === vehicleNumber)?.[0];
}
//# sourceMappingURL=vehicles.config.js.map