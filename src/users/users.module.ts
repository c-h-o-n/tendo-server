import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TeamsService } from 'src/teams/teams.service';
import { StorageService } from 'src/storage/storage.service';
import { MatchService } from 'src/match/match.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TeamsService, MatchService, StorageService],
})
export class UsersModule {}
