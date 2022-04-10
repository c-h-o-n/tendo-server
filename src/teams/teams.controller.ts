import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// types
import { Request } from 'express';
import { CreateTeamDto } from './dto/create-team.dto';

// services
import { TeamsService } from './teams.service';
import { StorageService } from 'src/storage/storage.service';

@Controller('teams')
export class TeamsController {
  constructor(private teamService: TeamsService, private storageService: StorageService) {}

  // Create a team
  @Post()
  createTeam(@Body() body: CreateTeamDto, @Req() req: Request) {
    const { user } = req;
    console.log('user', user);
    return this.teamService.createTeam(body, user);
  }

  // Get all team
  @Get()
  getAllTeam() {
    return this.teamService.getAllTeam();
  }

  // Get team by id
  @Get(':id')
  async getTeam(@Param('id') id: string): Promise<any> {
    const team = await this.teamService.getTeam(id);

    const members = team.TeamMember.map((member) => {
      return {
        id: member.User.id,
        firstName: member.User.firstName,
        lastName: member.User.lastName,
        avatarUrl: member.User.avatarUrl,
        role: member.role,
        mvps: member.User._count.Match,
      };
    });

    return {
      id: team.id,
      name: team.name,
      location: team.location,
      logoUrl: team.logoUrl,
      wins: team.wins,
      loses: team.loses,
      games: team.wins + team.loses,
      elo: team.elo,
      members: members,
    };
  }

  // Update team by id
  @Patch(':id')
  editTeam(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.teamService.updateTeam(id, body, req.user);
  }

  // Delete team by id
  @Delete(':id')
  deleteTeam(@Param('id') id: string) {
    return this.teamService.deleteTeam(id);
  }

  // Join team by id
  @Post(':id/join')
  joinTeam(@Param('id') id: string, @Req() req: Request) {
    return this.teamService.joinTeam(id, req.user);
  }

  // Leave team by id
  @Get(':id/leave')
  leaveTeam(@Param('id') id: string) {
    return this.teamService.leaveTeam(id);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  async uploadLogo(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Req() request: Request) {
    const logoUrl = await this.storageService.upload(`logos/${id}`, file.mimetype, file.buffer, [{}]);
    const updatedTeam = await this.teamService.updateTeam(id, { logoUrl: logoUrl }, request.user);

    return {
      location: updatedTeam.location,
      name: updatedTeam.name,
      logoUrl: updatedTeam.logoUrl,
    };
  }
}
