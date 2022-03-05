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
  async getUser(@Param('username') username) {
    const user = await this.userService.getUserByUsername(username);
    const mvps = await this.userService.getUserMvpCount(user.id);

    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      avatarUrl: user.avatarUrl,
      wins: user.wins,
      loses: user.loses,
      games: user.wins + user.loses,
      elo: user.elo,
      age: new Date().getUTCFullYear() - user.birthDate.getUTCFullYear(),
      mvps: mvps,
      height: user.height,
      weight: user.weight,
      intro: user.intro,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };
  }

  @Get(':id/teams')
  async getTeamsByUserId(@Param('id') id: string): Promise<any> {
    const teams = await this.teamService.getUsersTeams(id);
    const response = [];

    for (const team of teams) {
      const members = team.TeamMember.map((member) => {
        return {
          id: member.User.id,
          firstName: member.User.firstName,
          lastName: member.User.lastName,
          avatarUrl: member.User.avatarUrl,
          role: member.role,
          mvps: member.User._count.Match,
        };
      });
      response.push({
        id: team.id,
        name: team.name,
        location: team.location,
        logoUrl: team.logoUrl,
        wins: team.wins,
        loses: team.loses,
        games: team.wins + team.loses,
        elo: team.elo,
        members: members,
      });
    }
    return response;
  }

  // upload profile image
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
    const avatarUrl = await this.storageService.upload(`avatars/${id}`, file.mimetype, file.buffer, [{}]);
    console.log(avatarUrl);
    const updatedUser = await this.userService.updateUser(id, { avatarUrl: avatarUrl });

    return {
      username: updatedUser.username,
      avatarUrl: updatedUser.avatarUrl,
    };
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
