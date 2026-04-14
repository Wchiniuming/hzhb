import { IsString, IsOptional, IsDateString, IsUUID, IsArray, IsObject } from 'class-validator';

export class CreateRequirementDto {
  @IsString()
  originType: string;

  @IsString()
  @IsOptional()
  originEntityId?: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  targetDate: string;

  @IsString()
  responsibleType: string;

  @IsString()
  @IsOptional()
  responsibleId?: string;
}

export class UpdateRequirementDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  targetDate?: string;

  @IsString()
  @IsOptional()
  responsibleType?: string;

  @IsString()
  @IsOptional()
  responsibleId?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class CreatePlanDto {
  @IsString()
  requirementId: string;

  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  steps?: Record<string, any>[];

  @IsObject()
  @IsOptional()
  timeline?: Record<string, any>;

  @IsObject()
  @IsOptional()
  responsibilities?: Record<string, any>;
}

export class UpdatePlanDto {
  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  steps?: Record<string, any>[];

  @IsObject()
  @IsOptional()
  timeline?: Record<string, any>;

  @IsObject()
  @IsOptional()
  responsibilities?: Record<string, any>;

  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateProgressDto {
  @IsString()
  responsibleId: string;

  @IsString()
  @IsOptional()
  details?: string;
}

export class AcceptPlanDto {
  @IsString()
  result: string;

  @IsString()
  @IsOptional()
  comments?: string;
}