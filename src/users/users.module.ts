import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TeamsService } from 'src/teams/teams.service';
import { MatchService } from 'src/match/match.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [UsersController],
  providers: [UsersService, TeamsService, MatchService],
})
export class UsersModule {}
