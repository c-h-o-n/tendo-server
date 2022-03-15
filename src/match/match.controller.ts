import { Controller, Get, Param } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Get(':id')
  async getMatch(@Param('id') id: string) {
    const match = await this.matchService.getMatch(id);
    return {
      id: match.id,
      status: match.status,
      datetime: match.datetime,
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
}
