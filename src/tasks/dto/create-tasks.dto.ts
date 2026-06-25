import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'buy ...' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '....' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;
}
