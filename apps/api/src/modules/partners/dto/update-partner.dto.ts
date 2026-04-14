import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdatePartnerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsObject()
  @IsOptional()
  contactInfo?: Record<string, any>;

  @IsString()
  @IsOptional()
  status?: string;
}