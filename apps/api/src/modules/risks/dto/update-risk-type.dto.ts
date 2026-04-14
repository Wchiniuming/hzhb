import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateRiskTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}