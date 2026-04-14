import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsObject()
  contactInfo?: object;
}