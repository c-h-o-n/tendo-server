import { Module } from '@nestjs/common';
import { CronModule } from 'src/cron/cron.module';
import { NotificationModule } from 'src/notification/notification.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [CronModule, NotificationModule],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
