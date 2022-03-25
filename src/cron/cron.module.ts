import { Module } from '@nestjs/common';
import { NotificationModule } from 'src/notification/notification.module';
import { CronService } from './cron.service';

@Module({
  imports: [NotificationModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
