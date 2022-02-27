import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  ServiceUnavailableException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { StorageService } from 'src/storage/storage.service';
import { TeamsService } from 'src/teams/teams.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private teamService: TeamsService,
    private storageService: StorageService,
  ) {}

  @Get(':username')
  getUser(@Param('username') username) {
    return this.userService.getUserByUsername(username);
  }

  @Get(':id/teams')
  async getTeamsByUserId(@Param('id') id: string): Promise<any[]> {
    const teams = await this.teamService.getUsersTeams(id);

    return teams.map((team) => {
      return {
        id: team.id,
        name: team.name,
        location: team.location,
        wins: team.wins,
        loses: team.loses,
        elo: team.elo,
        members: team.TeamMember.map((user) => user.User),
      };
    });
  }

  // upload profile image
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
    const avatarUri = await this.storageService.upload(`avatars/${id}`, file.mimetype, file.buffer, [{}]);
    console.log(avatarUri);
    return this.userService.updateUser(id, { avatarUri: avatarUri });
  }

  @Get(':id/download')
  async downloadMedia(@Param('id') id: string, @Res() res: Response) {
    let storageFile: any;
    try {
      storageFile = await this.storageService.get('avatars/' + id);
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        throw new NotFoundException('image not found');
      } else {
        throw new ServiceUnavailableException('internal error');
      }
    }
    // res.setHeader('Content-Type', storageFile.contentType);
    res.setHeader('Cache-Control', 'max-age=60d');
    res.end(storageFile.buffer);
  }
}
