import { Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MatchService } from 'src/match/match.service';
import { NotificationModule } from 'src/notification/notification.module';
import { CronService } from './cron.service';

@Module({
  imports: [NotificationModule],
  providers: [CronService, MatchService, SchedulerRegistry],
  exports: [CronService],
})
export class CronModule {}
