import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';

// controllers
import { AuthController } from './auth.controller';

// services
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    PassportModule.register({}),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get<string>('jwt.access.secret'),
          signOptions: {
            expiresIn: config.get<string | number>('jwt.access.expiresIn'),
          },
        };
      },
      inject: [ConfigService],
    }),
    NotificationModule,
  ],
  providers: [
    AuthService,
    PasswordService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    UsersService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
