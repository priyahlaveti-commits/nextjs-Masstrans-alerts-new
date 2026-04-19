"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const alarms_config_1 = require("../config/alarms.config");
const vehicles_config_1 = require("../config/vehicles.config");
const MASSTRANS_API_URL = 'http://52.66.177.17:12056/api/v1/basic/alarm/count';
const MASSTRANS_API_KEY = 'ytU2t%2FveJMrA3lyyuFfttL6rf1DUBjRPZjkeTSTNX3mg0DrdI9PhUJFysOUzfMJjwtSvS7K7y8c1sO0%3D';
let AlertsService = class AlertsService {
    async getAlarmCount(vehicleNumber, alarmName, date) {
        const terid = (0, vehicles_config_1.getTerIdByVehicle)(vehicleNumber);
        if (!terid) {
            throw new Error(`No terid found for vehicle: ${vehicleNumber}`);
        }
        const alarmTypeId = (0, alarms_config_1.getAlarmTypeId)(alarmName);
        if (!alarmTypeId) {
            throw new Error(`No alarm type ID found for alarm: ${alarmName}`);
        }
        const starttime = `${date} 00:00:00`;
        const endtime = `${date} 23:59:59`;
        const body = {
            key: MASSTRANS_API_KEY,
            terid: [terid],
            type: alarmTypeId,
            starttime,
            endtime,
        };
        const response = await fetch(MASSTRANS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Masstrans API error: ${response.status}`);
        }
        const json = await response.json();
        const record = json?.data?.[0];
        const count = record?.count ?? 0;
        return { count, terid, date, alarmName };
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)()
], AlertsService);
//# sourceMappingURL=alerts.service.js.map