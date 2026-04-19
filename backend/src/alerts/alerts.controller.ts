import { Controller, Post, Body, Get } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { getVehicleList } from '../config/vehicles.config';
import { getAlarmTypeList } from '../config/alarms.config';

class GetAlarmCountDto {
  vehicleNumber: string;
  alarmName: string;
  date: string; // YYYY-MM-DD
}

class GetAlarmDetailDto {
  vehicleNumber: string;
  date: string; // YYYY-MM-DD
}

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  /**
   * GET /alerts/vehicles
   * Returns list of vehicles from config for the frontend dropdown.
   */
  @Get('vehicles')
  getVehicles() {
    return getVehicleList();
  }

  /**
   * GET /alerts/alarm-types
   * Returns list of alarm types from config for the frontend dropdown.
   */
  @Get('alarm-types')
  getAlarmTypes() {
    return getAlarmTypeList();
  }

  /**
   * POST /alerts/count
   * Fetches real alarm count from Masstrans API for a given vehicle, alarm and date.
   */
  @Post('count')
  async getAlarmCount(@Body() dto: GetAlarmCountDto) {
    return this.alertsService.getAlarmCount(
      dto.vehicleNumber,
      dto.alarmName,
      dto.date,
    );
  }

  /**
   * POST /alerts/details
   * Fetches detailed alarm records from Masstrans API for a given vehicle and date.
   * Returns all alert types (High-speed, Low voltage, etc.) in one response.
   */
  @Post('details')
  async getAlarmDetails(@Body() dto: GetAlarmDetailDto) {
    return this.alertsService.getAlarmDetails(
      dto.vehicleNumber,
      dto.date,
    );
  }
}
