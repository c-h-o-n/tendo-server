import { Controller, Get, Param } from '@nestjs/common';
import { TeamsService } from 'src/teams/teams.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService, private teamService: TeamsService) {}

  @Get(':username')
  async getUser(@Param('username') username): Promise<any> {
    return this.userService.getUserByUsername(username);
  }

  @Get(':id/teams')
  async getTeamsByUserId(@Param('id') id: string): Promise<any[]> {
    const teams = await this.teamService.getUsersTeams(id);

    return teams.map((team) => {
      return {
        id: team.id,
        name: team.name,
        location: team.location,
        wins: team.wins,
        loses: team.loses,
        elo: team.elo,
        members: team.TeamMember.map((user) => user.User),
      };
    });
  }
}
