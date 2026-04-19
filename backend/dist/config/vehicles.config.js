"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VEHICLES = void 0;
exports.getVehicleList = getVehicleList;
exports.getTerIdByVehicle = getTerIdByVehicle;
exports.VEHICLES = {
    "00C4002F1F": "AP39WF8584",
    "00C400373E": "TN14AR7549",
    "00C400330E": "TN14AR3907",
    "00C4003341": "TN14AS0825",
    "00C4003345": "TN14AR6084",
    "00C40032DD": "TN14AR9230",
    "00C4003672": "TN14AS0860",
    "00C400371C": "TN14AR7503",
    "00C4003418": "TN14AR3998",
    "00C40037A0": "TN14AR9290",
    "00C4003367": "TN14AR6430",
    "00C4003737": "TN14AR7591",
    "00C40032FA": "AP39WF8589",
    "00C4002F8A": "AP39WF8593",
    "00C4002F58": "AP39WG0252",
    "00C4003348": "AP39WG0271",
    "00C4002F61": "AP39WG4628",
    "00C4003319": "AP39WG4630",
    "00C4002E46": "TS07UM5012",
    "00C40037AD": "AP39WN7301",
    "00C40037A9": "AP39WN7302",
    "00C4003396": "AP39WN7281",
    "00C400331F": "AP39WN7280",
    "00C4003335": "AP39WN7306",
    "00C400339B": "AP39WN7276",
    "00C4003307": "AP39WN7322",
    "00C4003380": "AP39WN7273",
    "00C400339A": "AP39WN7275",
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