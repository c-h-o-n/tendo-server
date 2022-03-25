import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // TODO upload avatar and attach url to avatarUrl prop
  async createUser(data: SignUpDto, passwordHash): Promise<User> {
    return await this.prisma.user.create({
      data: {
        username: data.username,
        passwordHash: passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        birthDate: new Date(1997, 12, 13),
        location: data.location,
        updatedAt: new Date(),
      },
    });
  }

  async getUser(id: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  }

  async getUserMvpCount(id: string): Promise<number> {
    const mvps = await this.prisma.match.aggregate({
      where: {
        mvpId: id,
      },
      _count: {
        mvpId: true,
      },
    });

    return mvps._count.mvpId;
  }

  async updateUser(id: string, data: any, user: any): Promise<User> {
    return await this.prisma.user.update({
      where: { id: id },
      data: {
        updatedAt: new Date(),
        updatedBy: user.id,
        ...data,
      },
    });
  }

  async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
