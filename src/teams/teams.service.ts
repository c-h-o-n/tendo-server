import { Injectable } from '@nestjs/common';
import { Team, TeamMember, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService, private userService: UsersService) {}

  // Create team and add the user as captain
  async createTeam(data: CreateTeamDto, user: any): Promise<Team> {
    return await this.prisma.team.create({
      data: {
        name: data.name,
        location: data.location,
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

  async getTeam(
    id: string,
  ): Promise<Team & { TeamMember: (TeamMember & { User: User & { _count: { Match: number } } })[] }> {
    return await this.prisma.team.findUnique({
      where: { id: id },
      include: {
        TeamMember: {
          include: {
            User: {
              include: {
                _count: {
                  select: {
                    Match: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getTeamsByUserId(
    id: string,
  ): Promise<(Team & { TeamMember: (TeamMember & { User: User & { _count: { Match: number } } })[] })[]> {
    return await this.prisma.team.findMany({
      where: {
        TeamMember: {
          some: {
            userId: id,
          },
        },
      },
      include: {
        TeamMember: {
          include: {
            User: {
              include: {
                _count: {
                  select: {
                    Match: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getTeamMembers(id: string): Promise<TeamMember[]> {
    return await this.prisma.teamMember.findMany({
      where: {
        teamId: id,
      },
    });
  }

  async updateTeam(id: string, data: any, user: any): Promise<Team> {
    return await this.prisma.team.update({
      where: {
        id: id,
      },
      data: {
        updatedAt: new Date(),
        updatedBy: user.id,
        ...data,
      },
    });
  }

  async deleteTeam(id: string): Promise<Team> {
    return await this.prisma.team.delete({ where: { id: id } });
  }

  async joinTeam(id: string, user: any): Promise<TeamMember> {
    return await this.prisma.teamMember.create({
      data: { updatedAt: new Date(), role: 'member', userId: user.id, teamId: id },
    });
  }

  async leaveTeam(id: string, user: any): Promise<TeamMember> {
    return await this.prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId: id,
          userId: user.id,
        },
      },
    });
  }
}
