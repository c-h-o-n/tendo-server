import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { config } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private config: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });

    const isPasswordValid = await this.passwordService.validatePassword(
      password,
      user.passwordHash,
    );

    if (user && isPasswordValid) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
