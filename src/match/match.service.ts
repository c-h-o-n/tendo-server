import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async createMatch(data: CreateMatchDto) {
    return await this.prisma.match.create({
      data: {
        teamAId: data.teamAId,
        teamBId: data.teamBId,
        datetime: new Date(data.datetime),
        status: 'scheduled',
        updatedAt: new Date(),
      },
      include: {
        Team_Match_teamAIdToTeam: {
          include: {
            TeamMember: {
              include: {
                User: {
                  include: { PushToken: true },
                },
              },
            },
          },
        },
        Team_Match_teamBIdToTeam: {
          include: {
            TeamMember: {
              include: {
                User: {
                  include: { PushToken: true },
                },
              },
            },
          },
        },
        User: true,
      },
    });
  }

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

  async getAllFixtures() {
    return await this.prisma.match.findMany({
      where: { datetime: { gt: new Date() } },
      include: {
        Team_Match_teamAIdToTeam: {
          include: {
            TeamMember: {
              include: {
                User: {
                  include: { PushToken: true },
                },
              },
            },
          },
        },
        Team_Match_teamBIdToTeam: {
          include: {
            TeamMember: {
              include: {
                User: {
                  include: { PushToken: true },
                },
              },
            },
          },
        },
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

  async updateMatch(id: string, data: any, user: any) {
    return await this.prisma.match.update({
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

  async deleteMatch(id: string) {
    return await this.prisma.match.delete({
      where: {
        id: id,
      },
    });
  }
}
