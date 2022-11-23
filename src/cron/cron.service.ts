import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Match, PushToken, Team, TeamMember, User } from '@prisma/client';
import { CronJob } from 'cron';
import { MatchService } from 'src/match/match.service';
import { NotificationService } from 'src/notification/notification.service';

type MatchDetails = Match & {
  Team_Match_teamAIdToTeam: Team & {
    TeamMember: (TeamMember & {
      User: User & {
        PushToken: PushToken[];
      };
    })[];
  };
  Team_Match_teamBIdToTeam: Team & {
    TeamMember: (TeamMember & {
      User: User & {
        PushToken: PushToken[];
      };
    })[];
  };
};

@Injectable()
export class CronService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private notificationService: NotificationService,
    private matchService: MatchService,
  ) {}

  async addCronJob(matchDetails: MatchDetails, participantsPushTokens: string[]) {
    try {
      const cronJob = new CronJob(matchDetails.datetime, () => {
        console.log('added cronjob works', matchDetails.id);
        this.matchService.updateMatch(matchDetails.id, { status: 'pending' }, null);
        this.notificationService.sendNotification(
          participantsPushTokens,
          `${matchDetails.Team_Match_teamAIdToTeam.name} - ${matchDetails.Team_Match_teamBIdToTeam.name}`,
          matchDetails.datetime.toDateString(),
          { url: 'matchup/' + matchDetails.id },
        );

        this.deleteCronJob(matchDetails.id);
      });

      this.schedulerRegistry.addCronJob(matchDetails.id, cronJob);
      cronJob.start();

      return cronJob;
    } catch (error) {
      console.log('cron add error', error);
    }
  }

  logAllCronJobs() {
    const cronJobs = this.schedulerRegistry.getCronJobs();

    cronJobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDates().toISOString();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      console.log(`job: ${key} -> next: ${next}`);
    });
  }

  deleteCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
  }

  async loadCronJobs(upComingMatches: MatchDetails[]) {
    for (const upComingMatch of upComingMatches) {
      const participants: any[] = [];
      participants.push(
        ...upComingMatch.Team_Match_teamAIdToTeam.TeamMember.flatMap((member) =>
          member.User.PushToken.map((pushToken) => pushToken.pushToken),
        ),
      );

      participants.push(
        ...upComingMatch.Team_Match_teamBIdToTeam.TeamMember.flatMap((member) =>
          member.User.PushToken.map((pushToken) => pushToken.pushToken),
        ),
      );

      await this.addCronJob(upComingMatch, participants);
    }
    this.logAllCronJobs();
    console.log('cron jobs loaded');
    return;
  }
}
