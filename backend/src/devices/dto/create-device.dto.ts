import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  name: string;

  @IsString()
  imei: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  driverId?: number;
}
