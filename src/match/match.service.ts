import { Injectable } from '@nestjs/common';
import { Match, Team } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async getFixturesByUserId(
    userId: string,
  ): Promise<(Match & { Team_Match_teamBIdToTeam: Team; Team_Match_teamAIdToTeam: Team })[]> {
    return await this.prisma.match.findMany({
      where: {
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
