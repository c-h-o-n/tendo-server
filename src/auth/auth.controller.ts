import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  signin(@Req() req: Request) {
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
