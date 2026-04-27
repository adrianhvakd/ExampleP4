import { IsAlphanumeric, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { TipoPlanta } from '../entities/jardin.entity';

export class CreateJardinDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  nombre?: string;

  @IsNotEmpty()
  @IsEnum(TipoPlanta)
  tipo?: TipoPlanta;

  @IsNumber()
  @IsNotEmpty()
  largo?: number;

  @IsNumber()
  @IsNotEmpty()
  ancho?: number;
}
