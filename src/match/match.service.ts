import { Injectable } from '@nestjs/common';
import { Match, Team, TeamMember, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async getMatch(id: string) {
    return await this.prisma.match.findUnique({
      where: {
        id: id,
      },
      include: {
        Team_Match_teamAIdToTeam: {
          include: {
            TeamMember: {
              include: {
                User: true,
              },
            },
          },
        },
        Team_Match_teamBIdToTeam: {
          include: {
            TeamMember: {
              include: {
                User: true,
              },
            },
          },
        },
        User: true,
      },
    });
  }

  async getFixturesByUserId(userId: string) {
    return await this.prisma.match.findMany({
      where: {
        datetime: {
          gt: new Date(),
        },
        OR: [
          {
            Team_Match_teamAIdToTeam: {
              TeamMember: {
                some: {
                  userId: userId,
                },
              },
            },
          },
          {
            Team_Match_teamBIdToTeam: {
              TeamMember: {
                some: {
                  userId: userId,
                },
              },
            },
          },
        ],
      },
      include: {
        Team_Match_teamAIdToTeam: true,
        Team_Match_teamBIdToTeam: true,
      },
    });
  }
}
