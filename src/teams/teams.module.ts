import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, UsersService],
})
export class TeamsModule {}
