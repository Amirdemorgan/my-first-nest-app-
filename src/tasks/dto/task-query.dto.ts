import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class TaskQueryDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  completed?: boolean;
}
