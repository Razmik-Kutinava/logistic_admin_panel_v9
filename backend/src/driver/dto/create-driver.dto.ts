import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  licenseNumber: string;

  @IsString()
  @IsOptional()
  status?: string;
}
