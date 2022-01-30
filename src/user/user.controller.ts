import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':username')
  getUser(@Param('username') username) {
    return this.userService.getUserByUsername(username);
  }
}
