import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { NotificationService } from 'src/notification/notification.service';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private notificationService: NotificationService) {}

  @Public()
  @Post('signup')
  async signup(@Body() body: SignUpDto) {
    const createdUser = await this.authService.signup(body);
    return {
      id: createdUser.id,
      username: createdUser.username,
    };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Req() req: Request, @Body() body: SignInDto) {
    const { id: userId } = req.user as User;
    if (body.pushToken) {
      this.notificationService.attachPushTokenToUser(userId, body.pushToken);
    }
    return this.authService.signin(req.user);
  }

  @Public()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  refreshToken(@Req() req, @Body() body) {
    return this.authService.refreshToken(req.user, body);
  }

  @Post('signout')
  signout(@Req() req: Request) {
    return this.authService.signout(req);
  }
}
