import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  }

  async updateUser(id: string, data: any): Promise<User> {
    return await this.prisma.user.update({
      data: {
        updatedAt: new Date(),
        ...data,
      },
      where: { id: id },
    });
  }
}
