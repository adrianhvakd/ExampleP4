import { PartialType } from '@nestjs/mapped-types';
import { CreateJardinDto } from './create-jardin.dto';
import { IsOptional, IsAlphanumeric, IsEnum, IsNumber } from 'class-validator';
import { TipoPlanta } from '../entities/jardin.entity';

export class UpdateJardinDto extends PartialType(CreateJardinDto) {
  @IsAlphanumeric()
  @IsOptional()
  nombre?: string;

  @IsOptional()
  @IsEnum(TipoPlanta)
  tipo?: TipoPlanta;

  @IsNumber()
  @IsOptional()
  largo?: number;

  @IsNumber()
  @IsOptional()
  ancho?: number;
}
