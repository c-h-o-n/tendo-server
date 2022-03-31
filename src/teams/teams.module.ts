import { Module } from '@nestjs/common';
import { StorageModule } from 'src/storage/storage.module';
import { UsersService } from 'src/users/users.service';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports: [StorageModule],
  controllers: [TeamsController],
  providers: [TeamsService, UsersService],
})
export class TeamsModule {}
