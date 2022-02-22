import { Module } from '@nestjs/common';
import { TeamService } from 'src/team/team.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, TeamService],
})
export class UserModule {}
