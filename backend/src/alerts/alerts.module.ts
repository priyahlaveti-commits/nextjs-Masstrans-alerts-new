import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { PdfService } from './pdf.service';
import { MailService } from './mail.service';

@Module({
  controllers: [AlertsController],
  providers: [AlertsService, PdfService, MailService],
})
export class AlertsModule {}
