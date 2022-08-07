import { Module } from '@nestjs/common';
import { MatchService } from 'src/match/match.service';
import { NotificationModule } from 'src/notification/notification.module';
import { CronService } from './cron.service';

@Module({
  imports: [NotificationModule],
  providers: [CronService, MatchService],
  exports: [CronService],
})
export class CronModule {}
