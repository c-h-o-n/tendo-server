import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Expo } from 'expo-server-sdk';

@Injectable()
export class NotificationService {
  constructor(private schedulerRegistry: SchedulerRegistry, private expo: Expo) {}

  addCronJob(name: string, date: Date) {
    const cronJob = new CronJob(date, () => {
      console.log('added cronjob works');
      this.deleteCronJob(name);
    });

    this.schedulerRegistry.addCronJob(name, cronJob);
    cronJob.start();

    return cronJob;
  }

  getCronJobs() {
    const cronJobs = this.schedulerRegistry.getCronJobs();
    cronJobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDates().toDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      console.log(`job: ${key} -> next: ${next}`);
    });
  }

  deleteCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
  }

  loadCronJobs() {
    return;
  }

  sendNotification() {
    return;
  }
}
