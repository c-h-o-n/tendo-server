import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// TODO make controllers prular: user -> users, team -> teams
@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
