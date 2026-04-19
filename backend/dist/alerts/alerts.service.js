"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const alarms_config_1 = require("../config/alarms.config");
const vehicles_config_1 = require("../config/vehicles.config");
const pdf_service_1 = require("./pdf.service");
const mail_service_1 = require("./mail.service");
const MASSTRANS_API_BASE = 'http://52.66.177.17:12056/api/v1/basic/alarm';
const MASSTRANS_API_KEY = 'ytU2t%2FveJMrA3lyyuFfttL6rf1DUBjRPZjkeTSTNX3mg0DrdI9PhUJFysOUzfMJjwtSvS7K7y8c1sO0%3D';
const DETAIL_ALARM_TYPES = Object.keys(alarms_config_1.ALARM_TYPES).map(Number);
let AlertsService = class AlertsService {
    pdfService;
    mailService;
    constructor(pdfService, mailService) {
        this.pdfService = pdfService;
        this.mailService = mailService;
    }
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
        const response = await fetch(`${MASSTRANS_API_BASE}/count`, {
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
    async getAlarmDetails(vehicleNumber, date) {
        const terid = (0, vehicles_config_1.getTerIdByVehicle)(vehicleNumber);
        if (!terid) {
            throw new Error(`No terid found for vehicle: ${vehicleNumber}`);
        }
        const starttime = `${date} 00:00:00`;
        const endtime = `${date} 23:00:00`;
        const body = {
            key: MASSTRANS_API_KEY,
            terid: [terid],
            type: DETAIL_ALARM_TYPES,
            starttime,
            endtime,
        };
        const response = await fetch(`${MASSTRANS_API_BASE}/detail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Masstrans API error: ${response.status}`);
        }
        const json = await response.json();
        if (json.errorcode !== 200 || !Array.isArray(json.data)) {
            return { vehicleNumber, date, totalAlerts: 0, alerts: [] };
        }
        const alerts = json.data.map((item, index) => ({
            sNo: index + 1,
            time: item.gpstime || item.time || '',
            alertType: alarms_config_1.ALARM_TYPES[item.type] || `Unknown (${item.type})`,
            alertTypeId: item.type,
            speed: item.speed ?? 0,
            latitude: item.gpslat || '',
            longitude: item.gpslng || '',
            direction: item.direction ?? 0,
            description: item.content || '',
        }));
        return {
            vehicleNumber,
            date,
            totalAlerts: alerts.length,
            alerts,
        };
    }
    async getBulkAlarmCounts(vehicleNumber, date) {
        let terids;
        if (vehicleNumber === 'All' || !vehicleNumber) {
            terids = Object.keys(vehicles_config_1.VEHICLES);
        }
        else {
            const terid = (0, vehicles_config_1.getTerIdByVehicle)(vehicleNumber);
            if (!terid)
                throw new Error(`No terid found for vehicle: ${vehicleNumber}`);
            terids = [terid];
        }
        const starttime = `${date} 00:00:00`;
        const endtime = `${date} 23:59:59`;
        const typeIds = Object.keys(alarms_config_1.ALARM_TYPES).map(Number);
        const countPromises = typeIds.map(async (typeId) => {
            try {
                const body = {
                    key: MASSTRANS_API_KEY,
                    terid: terids,
                    type: typeId,
                    starttime,
                    endtime,
                };
                const response = await fetch(`${MASSTRANS_API_BASE}/count`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                if (!response.ok)
                    return { typeId, name: alarms_config_1.ALARM_TYPES[typeId], count: 0 };
                const json = await response.json();
                const count = json?.data?.[0]?.count ?? 0;
                return { typeId, name: alarms_config_1.ALARM_TYPES[typeId], count };
            }
            catch (err) {
                console.error(`Failed to fetch count for type ${typeId}:`, err);
                return { typeId, name: alarms_config_1.ALARM_TYPES[typeId], count: 0 };
            }
        });
        return Promise.all(countPromises);
    }
    async sendAlertsEmail(vehicleNumber, date, emails) {
        const data = await this.getAlarmDetails(vehicleNumber, date);
        if (!data.alerts || data.alerts.length === 0) {
            throw new Error('No alerts found for the selected vehicle and date.');
        }
        const pdfBuffer = await this.pdfService.generateAlertsPdf(vehicleNumber, date, data.alerts);
        const subject = `Alert Report: ${vehicleNumber} (${date})`;
        const text = `Please find the below report\n\nTotal Alerts: ${data.totalAlerts}`;
        const attachments = [
            {
                filename: `Alerts_${vehicleNumber}_${date}.pdf`,
                content: pdfBuffer,
            },
        ];
        return this.mailService.sendMailWithAttachment(emails, subject, text, attachments);
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pdf_service_1.PdfService,
        mail_service_1.MailService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map