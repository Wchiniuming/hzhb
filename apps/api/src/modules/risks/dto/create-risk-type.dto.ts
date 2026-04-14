import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateRiskTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}