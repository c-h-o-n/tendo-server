import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PasswordService } from './password.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { UserService } from 'src/user/user.service';

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
  ],
  providers: [
    AuthService,
    PasswordService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
