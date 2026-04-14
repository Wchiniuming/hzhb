import { IsString, IsOptional, IsDateString, IsArray, IsNumber, Min, Max, IsUUID } from 'class-validator';

export class CreateIndicatorDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  weight: number;

  @IsString()
  @IsOptional()
  scoringCriteria?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateIndicatorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  scoringCriteria?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetPartners?: string[];

  @IsString()
  cycle: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assessors?: string[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  method: string;
}

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetPartners?: string[];

  @IsString()
  @IsOptional()
  cycle?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assessors?: string[];

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class CreateAssessmentDto {
  @IsUUID()
  planId: string;

  @IsUUID()
  partnerId: string;

  @IsDateString()
  startDate: string;
}

export class ScoreIndicatorDto {
  @IsString()
  indicatorId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  autoScore?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  manualScore?: number;

  @IsString()
  @IsOptional()
  comments?: string;
}