import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
