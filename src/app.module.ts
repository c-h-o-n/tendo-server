import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// modules
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { StorageModule } from './storage/storage.module';
import { SearchModule } from './search/search.module';
import { MatchModule } from './match/match.module';
import { NotificationModule } from './notification/notification.module';
import { CronModule } from './cron/cron.module';

import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    StorageModule,
    SearchModule,
    MatchModule,
    NotificationModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
