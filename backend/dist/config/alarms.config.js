"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALARM_TYPES = void 0;
exports.getAlarmTypeList = getAlarmTypeList;
exports.getAlarmTypeId = getAlarmTypeId;
exports.ALARM_TYPES = {
    1: "Video loss alarm",
    2: "Motion detection alarm",
    3: "Camera-covering alarm",
    4: "Abnormal storage alarm",
    5: "IO 1",
    6: "IO 2",
    7: "IO 3",
    8: "IO 4",
    9: "IO 5",
    10: "IO 6",
    11: "IO 7",
    12: "IO 8",
    13: "Emergency alarm",
    15: "High-speed alarm",
    16: "Low voltage alarm",
    17: "Acceleration alarm",
    18: "Geo-fencing alarm",
    19: "Illegal shutdown",
    20: "Temperature alarm",
    21: "Distance alarm",
};
function getAlarmTypeList() {
    return Object.entries(exports.ALARM_TYPES).map(([typeId, name]) => ({
        typeId: Number(typeId),
        name,
    }));
}
function getAlarmTypeId(name) {
    const entry = Object.entries(exports.ALARM_TYPES).find(([, n]) => n === name);
    return entry ? Number(entry[0]) : undefined;
}
//# sourceMappingURL=alarms.config.js.map