import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(term: string): Promise<any> {
    const users = await this.prisma.user.findMany({
      where: {
        username: {
          contains: term,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        username: true,
      },
    });

    const teams = await this.prisma.team.findMany({
      where: {
        name: {
          contains: term,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      users: users,
      teams: teams,
    };
  }
}
