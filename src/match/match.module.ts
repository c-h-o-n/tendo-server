import { Module } from '@nestjs/common';
import { NotificationModule } from 'src/notification/notification.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [NotificationModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
