import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [AuthModule, UsersModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
