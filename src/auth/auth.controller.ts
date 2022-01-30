import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { JwtRefreshTokenGuard } from './guard/jwt-refresh.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request): Promise<any> {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  refreshToken(@Req() req, @Body() body): Promise<any> {
    return this.authService.refreshToken(req.user, body);
  }

  @Public()
  @Post('register')
  register(@Body() body: any): Promise<any> {
    return this.authService.register(body);
  }

  @Post('logout')
  logout(@Req() req: Request): Promise<any> {
    return this.authService.logout(req);
  }
}
