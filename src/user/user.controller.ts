import { Controller, Get, Param } from '@nestjs/common';
import { TeamService } from 'src/team/team.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private teamService: TeamService) {}

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
