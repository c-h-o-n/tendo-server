import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post()
  createTeam(@Body() body: CreateTeamDto, @Req() req: Request) {
    const { user } = req;
    console.log('user', user);
    return this.teamService.createTeam(body, user);
  }

  @Get(':id')
  getTeam(@Param('id') id: string) {
    return this.teamService.getTeam(id);
  }

  @Patch(':id')
  editTeam(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.teamService.patchTeam(id, body, req.user);
  }

  @Delete(':id')
  deleteTeam(@Param('id') id: string) {
    return this.teamService.deleteTeam(id);
  }
}
