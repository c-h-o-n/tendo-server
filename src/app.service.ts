import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CronService } from './cron/cron.service';
import { MatchService } from './match/match.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private cronService: CronService, private matchService: MatchService) {}
  async onApplicationBootstrap() {
    const upComingMatches = await this.matchService.getAllFixtures();
    this.cronService.loadCronJobs(upComingMatches);
  }

  getHello(): string {
    return 'Hello World! This is a protected route!';
  }
}
