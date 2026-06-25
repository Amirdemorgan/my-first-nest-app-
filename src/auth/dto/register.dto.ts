import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Amirdemorgan@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'number(1234566)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Amir' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
