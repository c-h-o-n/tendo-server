import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    return user;
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
      },
    });
  }
}
