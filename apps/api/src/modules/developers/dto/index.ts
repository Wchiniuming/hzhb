import { IsString, IsOptional, IsNumber, IsUUID, IsDateString, Min, Max } from 'class-validator';

export class CreateDeveloperDto {
  @IsUUID()
  partnerId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsNumber()
  @IsOptional()
  @Min(18)
  @Max(100)
  age?: number;

  @IsString()
  @IsOptional()
  contact?: string;
}

export class UpdateDeveloperDto {
  @IsUUID()
  @IsOptional()
  partnerId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsNumber()
  @IsOptional()
  @Min(18)
  @Max(100)
  age?: number;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class AddSkillDto {
  @IsUUID()
  skillTagId: string;

  @IsString()
  proficiency: string;
}

export class UpdateSkillDto {
  @IsString()
  @IsOptional()
  proficiency?: string;
}

export class AddExperienceDto {
  @IsString()
  projectName: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AddCertificateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  issuingBody?: string;

  @IsDateString()
  issueDate: string;

  @IsDateString()
  @IsOptional()
  expireDate?: string;

  @IsUUID()
  @IsOptional()
  attachmentId?: string;
}
