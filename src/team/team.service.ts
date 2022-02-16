import { Injectable } from '@nestjs/common';
import { Team } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
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

  async getTeam(id: string): Promise<Team> {
    return await this.prisma.team.findFirst({ where: { id: id } });
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
}
