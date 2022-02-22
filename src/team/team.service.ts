import { Injectable } from '@nestjs/common';

// services
import { PrismaService } from 'src/prisma/prisma.service';

// types
import { Team, TeamMember } from '@prisma/client';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  // Create team and add the user as captain
  async createTeam(body: CreateTeamDto, user: any): Promise<Team> {
    return await this.prisma.team.create({
      data: {
        name: body.name,
        location: body.location,
        updatedAt: new Date(),
        createdBy: user.id,
        updatedBy: user.id,
        TeamMember: {
          create: {
            userId: user.id,
            role: 'captain',
            updatedAt: new Date(),
          },
        },
      },
    });
  }

  async getAllTeam(): Promise<Team[]> {
    return await this.prisma.team.findMany();
  }

  async getTeam(id: string): Promise<Team> {
    return await this.prisma.team.findFirst({ where: { id: id } });
  }

  async getUsersTeams(id: string): Promise<any[]> {
    return await this.prisma.team.findMany({
      where: {
        TeamMember: {
          some: {
            userId: id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        location: true,
        wins: true,
        loses: true,
        elo: true,
        TeamMember: {
          select: {
            User: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async deleteTeam(id: string): Promise<Team> {
    return await this.prisma.team.delete({ where: { id: id } });
  }

  async patchTeam(id: string, data: any, user: any): Promise<Team> {
    return await this.prisma.team.update({
      data: { updatedAt: new Date(), updatedBy: user.id, ...data },
      where: {
        id: id,
      },
    });
  }

  async joinTeam(id: string, user: any): Promise<TeamMember> {
    console.log(user);
    return await this.prisma.teamMember.create({
      data: { updatedAt: new Date(), role: 'member', userId: user.id, teamId: id },
    });
  }
}
