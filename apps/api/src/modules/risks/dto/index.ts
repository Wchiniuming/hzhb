import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateRiskTypeDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateRiskTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateRiskDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  typeId: string;

  @IsString()
  level: string;

  @IsString()
  @IsOptional()
  impact?: string;

  @IsString()
  @IsOptional()
  triggerConditions?: string;

  @IsString()
  @IsOptional()
  dispositionMeasures?: string;
}

export class UpdateRiskDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  typeId?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  impact?: string;

  @IsString()
  @IsOptional()
  triggerConditions?: string;

  @IsString()
  @IsOptional()
  dispositionMeasures?: string;
}