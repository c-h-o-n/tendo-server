import { IsDateString, IsString } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  teamAId: string;
  @IsString()
  teamBId: string;
  @IsDateString()
  datetime: string;
}
