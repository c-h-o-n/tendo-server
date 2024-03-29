import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Match } from '@prisma/client';
import { Request } from 'express';
import { CronService } from 'src/cron/cron.service';
import { NotificationService } from 'src/notification/notification.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(
    private matchService: MatchService,
    private cronService: CronService,
    private notificationService: NotificationService,
  ) {}

  @Post()
  async createMatch(@Body() body: CreateMatchDto) {
    const createdMatch = await this.matchService.createMatch(body);

    const members = createdMatch.Team_Match_teamAIdToTeam.TeamMember.map((member) => member.User);
    members.push(...createdMatch.Team_Match_teamBIdToTeam.TeamMember.map((member) => member.User));
    const pushTokens = [];
    for (const member of members) {
      if (member.PushToken.length) {
        const expoToken = await this.notificationService.getExpoPushTokenByUserId(member.id);
        pushTokens.push(...expoToken.map((et) => et.pushToken));
      }
    }
    this.cronService.addCronJob(createdMatch, pushTokens);
    return createdMatch;
  }

  // LATER WTF are these ? find better solution !
  @Get(':id')
  async getMatch(@Param('id') id: string) {
    const match = await this.matchService.getMatch(id);
    return {
      id: match.id,
      status: match.status,
      datetime: match.datetime,
      teamAScore: match.teamAScore,
      teamA: {
        id: match.Team_Match_teamAIdToTeam.id,
        location: match.Team_Match_teamAIdToTeam.location,
        name: match.Team_Match_teamAIdToTeam.name,
        logoUrl: match.Team_Match_teamAIdToTeam.logoUrl,

        members: match.Team_Match_teamAIdToTeam.TeamMember.map((member) => ({
          id: member.User.id,
          username: member.User.username,
          firstName: member.User.firstName,
          lastName: member.User.lastName,
          role: member.role,
        })),
      },
      teamBScore: match.teamBScore,
      teamB: {
        id: match.Team_Match_teamBIdToTeam.id,
        location: match.Team_Match_teamBIdToTeam.location,
        name: match.Team_Match_teamBIdToTeam.name,
        logoUrl: match.Team_Match_teamBIdToTeam.logoUrl,
        members: match.Team_Match_teamBIdToTeam.TeamMember.map((member) => ({
          id: member.User.id,
          username: member.User.username,
          firstName: member.User.firstName,
          lastName: member.User.lastName,
          role: member.role,
        })),
      },
      mvp: match.User,
    };
  }

  @Patch(':id')
  updateMatch(@Param('id') id: string, @Body() body: Partial<Match>, @Req() request: Request) {
    return this.matchService.updateMatch(id, body, request.user);
  }

  @Get('cron/all')
  getCrons() {
    return this.cronService.logAllCronJobs();
  }
  @Get('noti/send')
  sendNot() {
    return this.notificationService.sendNotification(
      ['ExponentPushToken[R8qZFFCOxl84OBOnpsUOt1]'],
      'From ur lover',
      'i love u so much!',
      { url: 'matchup/02414bf0-fb5d-4704-8d43-36560a4b80fe' },
    );
  }
}
