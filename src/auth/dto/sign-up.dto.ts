import { IsDateString, IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  location: string;
}
