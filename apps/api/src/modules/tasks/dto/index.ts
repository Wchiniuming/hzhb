import { IsString, IsOptional, IsDateString, IsUUID, IsNumber, IsArray } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  deliveryStandard?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsUUID()
  partnerId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  assigneeIds?: string[];
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  deliveryStandard?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsString()
  @IsOptional()
  status?: string;
}

export class AssignDeveloperDto {
  @IsUUID()
  developerId: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  responsibilities?: string;

  @IsDateString()
  @IsOptional()
  deliveryNode?: string;
}

export class UpdateAssignmentDto {
  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  responsibilities?: string;

  @IsDateString()
  @IsOptional()
  deliveryNode?: string;
}

export class UpdateProgressDto {
  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  details?: string;
}

export class CreateDelayRequestDto {
  @IsString()
  reason: string;

  @IsDateString()
  newEndDate: string;
}

export class SubmitDeliverableDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachmentIds?: string[];
}

export class AcceptDeliverableDto {
  @IsString()
  result: string;

  @IsString()
  @IsOptional()
  comments?: string;
}