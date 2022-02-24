import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';

import { TeamsService } from './teams.service';

// types
import { Request } from 'express';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private teamService: TeamsService) {}

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
  getTeam(@Param('id') id: string) {
    return this.teamService.getTeam(id);
  }

  // Update team by id
  @Patch(':id')
  editTeam(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.teamService.patchTeam(id, body, req.user);
  }

  // Delete team by id
  @Delete(':id')
  deleteTeam(@Param('id') id: string) {
    return this.teamService.deleteTeam(id);
  }

  // Join to team by id
  @Post(':id/join')
  joinTeam(@Param('id') id: string, @Req() req: Request) {
    return this.teamService.joinTeam(id, req.user);
  }
}
