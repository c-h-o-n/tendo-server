import { Injectable } from '@nestjs/common';

// services
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';

// types
import { Request } from 'express';
import { User } from '@prisma/client';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private config: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);

    if (user) {
      const isPasswordValid = await this.passwordService.validatePassword(password, user.passwordHash);

      if (isPasswordValid) {
        return user;
      }
    }

    return null;
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

  async signup(data: SignUpDto): Promise<User> {
    const passwordHash = await this.passwordService.hashPassword(data.password);

    return await this.userService.createUser(data, passwordHash);
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
    return { signout: req.user };
  }
}
