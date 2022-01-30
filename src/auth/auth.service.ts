import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Request } from 'express';
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

    if (user) {
      const isPasswordValid = await this.passwordService.validatePassword(
        password,
        user.passwordHash,
      );

      if (isPasswordValid) {
        return user;
      }
    }

    return null;
  }

  async login(user: any): Promise<any> {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.getAccessToken(payload),
      refresh_token: this.getRefreshToken(payload),
    };
  }

  async register(body: any): Promise<any> {
    const passwordHash = await this.passwordService.hashPassword(body.password);

    return await this.prisma.user.create({
      data: {
        username: body.username,
        passwordHash: passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        age: body.age,
        games: 0,
        wins: 0,
        loses: 0,
        location: body.location,
        updatedAt: new Date(),
      },
    });
  }

  async refreshToken(user: any, body: any): Promise<any> {
    console.log('body:', body);
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.getAccessToken(payload),
      refresh_token: this.getRefreshToken(payload),
    };
  }

  getAccessToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  getRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.config.get('jwt.refreshSecret'),
      expiresIn: '2days',
    });
  }

  async logout(req: Request): Promise<any> {
    return { logout: req.user };
  }
}
