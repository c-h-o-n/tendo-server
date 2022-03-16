import { IsString } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  teamAId: string;
  @IsString()
  teamBId: string;
  @IsString()
  datetime: string;
}
