import { Injectable } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private expo: Expo, private prisma: PrismaService) {}

  async sendNotification(pushTokens: string[], title: string, body: string, data?: any) {
    console.log('send', pushTokens);
    console.log(data);

    const messages: ExpoPushMessage[] = [];
    for (const pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is NOT a valid Expo push token`);
        continue;
      }
      console.log(`Push token ${pushToken} is a valid Expo push token`);

      messages.push({
        to: pushToken,
        title: title,
        body: body,
        data: data,
      });
    }

    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets = [];
    (async () => {
      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();
    return;
  }

  async attachPushTokenToUser(userId: string, pushToken: string) {
    return await this.prisma.pushToken.upsert({
      where: {
        userId_pushToken: {
          userId: userId,
          pushToken: pushToken,
        },
      },
      update: {},
      create: {
        userId: userId,
        pushToken: pushToken,
      },
    });
  }

  async getExpoPushTokenByUserId(userId: string) {
    return await this.prisma.pushToken.findMany({
      where: {
        userId: userId,
      },
      select: {
        pushToken: true,
      },
    });
  }

  async detachPushTokenFromUser(userId: string, pushToken: string) {
    return await this.prisma.pushToken.delete({
      where: {
        userId_pushToken: {
          userId: userId,
          pushToken: pushToken,
        },
      },
    });
  }
}
