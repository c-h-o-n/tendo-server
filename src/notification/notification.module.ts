import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import Expo from 'expo-server-sdk';

@Module({
  providers: [NotificationService, Expo],
  exports: [NotificationService],
})
export class NotificationModule {}
