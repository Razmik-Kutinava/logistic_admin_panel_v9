import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateZoneDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  driverId?: number;
}
