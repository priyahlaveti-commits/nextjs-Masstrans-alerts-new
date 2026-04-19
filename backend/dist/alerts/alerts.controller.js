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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsController = void 0;
const common_1 = require("@nestjs/common");
const alerts_service_1 = require("./alerts.service");
const vehicles_config_1 = require("../config/vehicles.config");
const alarms_config_1 = require("../config/alarms.config");
class GetAlarmCountDto {
    vehicleNumber;
    alarmName;
    date;
}
class GetAlarmDetailDto {
    vehicleNumber;
    date;
}
let AlertsController = class AlertsController {
    alertsService;
    constructor(alertsService) {
        this.alertsService = alertsService;
    }
    getVehicles() {
        return (0, vehicles_config_1.getVehicleList)();
    }
    getAlarmTypes() {
        return (0, alarms_config_1.getAlarmTypeList)();
    }
    async getAlarmCount(dto) {
        return this.alertsService.getAlarmCount(dto.vehicleNumber, dto.alarmName, dto.date);
    }
    async getAlarmDetails(dto) {
        return this.alertsService.getAlarmDetails(dto.vehicleNumber, dto.date);
    }
    async getBulkAlarmCounts(dto) {
        return this.alertsService.getBulkAlarmCounts(dto.vehicleNumber, dto.date);
    }
    async sendEmail(dto) {
        try {
            return await this.alertsService.sendAlertsEmail(dto.vehicleNumber, dto.date, dto.emails);
        }
        catch (err) {
            throw new Error(`Email process failed: ${err.message}`);
        }
    }
};
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Get)('vehicles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getVehicles", null);
__decorate([
    (0, common_1.Get)('alarm-types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertsController.prototype, "getAlarmTypes", null);
__decorate([
    (0, common_1.Post)('count'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetAlarmCountDto]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getAlarmCount", null);
__decorate([
    (0, common_1.Post)('details'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetAlarmDetailDto]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getAlarmDetails", null);
__decorate([
    (0, common_1.Post)('bulk-counts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getBulkAlarmCounts", null);
__decorate([
    (0, common_1.Post)('send-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "sendEmail", null);
exports.AlertsController = AlertsController = __decorate([
    (0, common_1.Controller)('alerts'),
    __metadata("design:paramtypes", [alerts_service_1.AlertsService])
], AlertsController);
//# sourceMappingURL=alerts.controller.js.map