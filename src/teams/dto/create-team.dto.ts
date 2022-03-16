import { Team } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto implements Partial<Team> {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}
