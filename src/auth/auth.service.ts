import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
    private passwordService: PasswordService,
    private config: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.getUserCredentials(username);

    if (user) {
      const isPasswordValid = await this.passwordService.validatePassword(password, user.passwordHash);

      if (isPasswordValid) {
        return user;
      }
    }

    return null;
  }

  async getUserCredentials(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        passwordHash: true,
      },
    });
  }

  async signin(user: any): Promise<any> {
    const payload = { username: user.username, sub: user.id };

    return {
      id: user.id,
      username: user.username,
      access_token: this.getAccessToken(payload),
      refresh_token: this.getRefreshToken(payload),
    };
  }

  async signup(body: SignUpDto): Promise<User> {
    const passwordHash = await this.passwordService.hashPassword(body.password);

    return await this.prisma.user.create({
      data: {
        username: body.username,
        passwordHash: passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        birthDate: new Date(1997, 12, 13),
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
      secret: this.config.get('jwt.refresh.secret'),
      expiresIn: this.config.get('jwt.refresh.expiresIn'),
    });
  }

  // TODO implement logout
  async signout(req: Request): Promise<any> {
    return { logout: req.user };
  }
}
