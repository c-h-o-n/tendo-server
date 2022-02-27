import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TeamsService } from 'src/teams/teams.service';
import { StorageService } from 'src/storage/storage.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TeamsService, StorageService],
})
export class UsersModule {}
