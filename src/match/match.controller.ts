import { Controller, Get, Param } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Get(':userId')
  async getFixturesByUserId(@Param('userId') userId) {
    const fixtures = await this.matchService.getFixturesByUserId(userId);
    const response = [];

    for (const fixture of fixtures) {
      const teamA = {
        id: fixture.Team_Match_teamAIdToTeam.id,
        name: fixture.Team_Match_teamAIdToTeam.name,
        location: fixture.Team_Match_teamAIdToTeam.location,
        logoUrl: fixture.Team_Match_teamAIdToTeam.logoUrl,
      };

      const teamB = {
        id: fixture.Team_Match_teamBIdToTeam.id,
        name: fixture.Team_Match_teamBIdToTeam.name,
        location: fixture.Team_Match_teamBIdToTeam.location,
        logoUrl: fixture.Team_Match_teamBIdToTeam.logoUrl,
      };
      response.push({
        id: fixture.id,
        datetime: fixture.datetime,
        status: fixture.status,
        teamA: teamA,
        teamB: teamB,
      });
    }

    return response;
  }
}
